import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { getIO } from '@/lib/socket-server';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET() {
  try {
    await connectDB();
    // Fetch only users who are in the team
    const users = await User.find({ team: { $exists: true, $not: { $size: 0 } } }, '_id name email role profilePic');
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId } = await req.json();

    // Get token from cookie
    const cookie = req.headers.get('cookie');
    const token = cookie
      ?.split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Verify the token
      const decodedToken: any = jwt.verify(token, JWT_SECRET);
      
      // Find the current user
      const currentUser = await User.findById(decodedToken.id);

      if (!currentUser) {
        return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
      }

      // Check if user has admin or manager role
      if (currentUser.role !== 'admin' && currentUser.role !== 'manager') {
        return NextResponse.json({ error: 'Unauthorized - Insufficient permissions' }, { status: 403 });
      }

      // Find the user to add to the team
      const userToAdd = await User.findById(userId);

      if (!userToAdd) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Add the user to the team array if not already there
      if (!userToAdd.team.includes(currentUser._id)) {
        userToAdd.team.push(currentUser._id);
        await userToAdd.save();
      }

      // Add the selected user to current user's team if not already there
      if (!currentUser.team.includes(userToAdd._id)) {
        currentUser.team.push(userToAdd._id);
        await currentUser.save();
      }

      // Emit socket event for real-time notification
      try {
        const io = getIO();
        io.emit('teamMemberAdded', {
          teamId: currentUser._id,
          userId: userToAdd._id,
          teamName: currentUser.name + "'s Team",
          userName: userToAdd.name
        });
      } catch (socketError) {
        console.error('Socket server error:', socketError);
        // Continue with the response even if socket fails
      }

      return NextResponse.json({ message: 'Team member added successfully!' });
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json({ error: 'Failed to add team member' }, { status: 500 });
  }
}
