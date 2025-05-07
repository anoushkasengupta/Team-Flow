import { NextResponse, NextRequest } from 'next/server';
import connectDB from '../../../lib/mongoose';
import Task from '../../../models/Task';
import User from '../../../models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getIO } from '../../../lib/socket-server';
import mongoose from 'mongoose';
import AuditLog from '../../../models/AuditLog';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

async function verifyToken(req: NextRequest): Promise<JwtPayload> {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    throw new Error('Unauthorized');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string') {
      throw new Error('Invalid token');
    }
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await verifyToken(req);

    const url = new URL(req.url);
    const filter = url.searchParams.get('filter');

    let query = {};
    switch (filter) {
      case 'assigned':
        query = { assignedTo: user.id };
        break;
      case 'created':
        query = { createdBy: user.id };
        break;
      case 'overdue':
        query = { dueDate: { $lt: new Date() }, status: { $ne: 'completed' } };
        break;
      case 'completed':
        query = { status: 'completed' };
        break;
      default:
        query = { assignedTo: user.id };
    }

    const tasks = await Task.find(query).sort({ dueDate: 1 });
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch tasks' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await verifyToken(req);
    const body = await req.json();

    const {
      title,
      description,
      dueDate,
      status,
      assignedTo,
      recurring,
      recurrenceType,
      recurrenceEndDate,
    } = body;

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return NextResponse.json({ error: 'Invalid assignedTo user ID' }, { status: 400 });
    }

    // Helper to generate due dates
    function generateDueDates(startDate, type, endDate) {
      const dates = [];
      let current = new Date(startDate);
      const maxOccurrences = 50; // safety limit
      let count = 0;
      const until = endDate ? new Date(endDate) : new Date(current);
      if (!endDate) {
        // If no end date, generate up to 1 year
        until.setFullYear(until.getFullYear() + 1);
      }
      while (current <= until && count < maxOccurrences) {
        dates.push(new Date(current));
        if (type === 'daily') current.setDate(current.getDate() + 1);
        else if (type === 'weekly') current.setDate(current.getDate() + 7);
        else if (type === 'monthly') current.setMonth(current.getMonth() + 1);
        else break;
        count++;
      }
      return dates;
    }

    let createdTasks = [];
    if (recurring) {
      const dueDates = generateDueDates(dueDate, recurrenceType, recurrenceEndDate);
      for (const d of dueDates) {
        const task = new Task({
          title,
          description,
          dueDate: d,
          status: status || 'pending',
          createdBy: user.id,
          assignedTo,
          recurring: true,
          recurrenceType,
          recurrenceEndDate: recurrenceEndDate ? new Date(recurrenceEndDate) : null,
        });
        await task.save();
        createdTasks.push(task);
        // Audit log for each created recurring task
        await AuditLog.create({
          userId: user.id,
          action: 'task_created',
          taskId: task._id,
          details: { title, description, dueDate: d, assignedTo },
        });
      }
    } else {
      const newTask = new Task({
        title,
        description,
        dueDate: new Date(dueDate),
        status: status || 'pending',
        createdBy: user.id,
        assignedTo,
      });
      await newTask.save();
      createdTasks.push(newTask);
      // Audit log for single created task
      await AuditLog.create({
        userId: user.id,
        action: 'task_created',
        taskId: newTask._id,
        details: { title, description, dueDate, assignedTo },
      });
    }

    // Get creator's name for notification
    const creator = await User.findById(user.id, 'name');
    const creatorName = creator ? creator.name : 'A team member';

    // Emit socket event for each created task
    try {
      const io = getIO();
      for (const task of createdTasks) {
        io.emit('taskCreated', task);
        io.emit('taskAssigned', {
          taskId: task._id,
          taskTitle: task.title,
          assignedBy: creatorName,
          assignedTo: assignedTo
        });
      }
    } catch (socketError) {
      console.error('Socket server error:', socketError);
      // Continue with the response even if socket fails
    }

    return NextResponse.json(
      recurring ? createdTasks : createdTasks[0],
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create task' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = await verifyToken(req);
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    if (body.assignedTo && !mongoose.Types.ObjectId.isValid(body.assignedTo)) {
      return NextResponse.json({ error: 'Invalid assignedTo user ID' }, { status: 400 });
    }

    const task = await Task.findById(body.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Only allow update if user is creator or assignee
    if (task.createdBy.toString() !== user.id && task.assignedTo.toString() !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const previousAssignee = task.assignedTo;
    
    task.title = body.title || task.title;
    task.description = body.description || task.description;
    task.dueDate = body.dueDate ? new Date(body.dueDate) : task.dueDate;
    task.status = body.status || task.status;
    task.assignedTo = body.assignedTo || task.assignedTo;

    await task.save();

    // Audit log for update
    await AuditLog.create({
      userId: user.id,
      action: 'task_updated',
      taskId: task._id,
      details: { ...body },
    });

    // Emit socket event for updated task
    try {
      const io = getIO();
      io.emit('taskUpdated', task);
      
      // If assignee was changed, emit task assigned notification
      if (body.assignedTo && body.assignedTo !== previousAssignee.toString()) {
        const creator = await User.findById(user.id, 'name');
        const creatorName = creator ? creator.name : 'A team member';
        
        io.emit('taskAssigned', {
          taskId: task._id,
          taskTitle: task.title,
          assignedBy: creatorName,
          assignedTo: body.assignedTo
        });
      }
    } catch (socketError) {
      console.error('Socket server error:', socketError);
    }

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update task' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const user = await verifyToken(req);
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Only allow delete if user is creator or assignee
    if (task.createdBy.toString() !== user.id && task.assignedTo.toString() !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Task.findByIdAndDelete(id);

    // Audit log for delete
    await AuditLog.create({
      userId: user.id,
      action: 'task_deleted',
      taskId: id,
      details: {},
    });

    // Emit socket event for deleted task
    try {
      const io = getIO();
      io.emit('taskDeleted', { id });
    } catch (socketError) {
      console.error('Socket server error:', socketError);
    }

    return NextResponse.json({ message: 'Task deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete task' }, { status: 400 });
  }
}
