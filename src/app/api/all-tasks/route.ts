import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Task from '@/models/Task';

export async function GET(req: Request) {
  try {
    await connectDB();

    const tasks = await Task.find({});

    return NextResponse.json(
      { message: 'Tasks fetched successfully', tasks },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
