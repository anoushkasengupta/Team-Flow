import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongoose';
import User from '../../../models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}, '_id name').lean();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
