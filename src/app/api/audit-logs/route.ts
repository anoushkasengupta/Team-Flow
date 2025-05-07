import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongoose';
import AuditLog from '../../../models/AuditLog';
import User from '../../../models/User';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const taskId = url.searchParams.get('taskId');
    const action = url.searchParams.get('action');
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);
    const query: any = {};
    if (userId) query.userId = userId;
    if (taskId) query.taskId = taskId;
    if (action) query.action = action;
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .populate('taskId', 'title');
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch audit logs' }, { status: 500 });
  }
} 