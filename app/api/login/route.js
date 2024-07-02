import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { db } from '@/utils';
import { ADMIN } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { secretKey } from '@/config/secret';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // Find ADMIN by email
    const admin = await db
      .select()
      .from(ADMIN)
      .where(eq(ADMIN.email, email))
      .execute();
    if (admin.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const validPassword = await bcrypt.compare(password, admin[0].password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const generatedToken = jwt.sign(
      { id: admin[0].id, nama: admin[0].nama, email: admin[0].email },
      secretKey,
      { expiresIn: '3h' }
    );

    // Return success response with token in headers
    return NextResponse.json(
      { message: 'Login success', generatedToken },
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=${generatedToken}; path=/`,
        },
      }
    );
  } catch (error) {
    console.error('Error in POST /api/login:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
