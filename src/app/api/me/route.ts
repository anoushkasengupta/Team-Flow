import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongoose';
import User from '../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie');
  const token = cookie
    ?.split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decodedToken: any = jwt.verify(token, JWT_SECRET);
    await connectDB();
    const user = await User.findById(decodedToken.id).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
