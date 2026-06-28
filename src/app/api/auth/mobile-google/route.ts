import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
    }

    // Verify the Google ID Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID || '', 
        process.env.GOOGLE_ANDROID_CLIENT_ID || '', // Expose this if needed for Android audience matching
      ].filter(Boolean),
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid Google Token' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user exists
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // Create new user
      user = await User.create({
        email: payload.email,
        name: payload.name,
        image: payload.picture,
        emailVerified: new Date(),
        isHost: false
      });
    }

    // Generate JWT token for mobile app session
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback_secret';
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      secret,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        isHost: user.isHost
      }
    });

  } catch (error: any) {
    console.error('Mobile Google Login Error:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 500 });
  }
}
