import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/lib/models/Admin';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    let adminData = null;

    try {
      await dbConnect();
      const admin = await Admin.findOne({ email: cleanEmail, isActive: true });
      if (admin) {
        const isValid = await comparePassword(password, admin.passwordHash);
        if (isValid) {
          admin.lastLogin = new Date();
          await admin.save().catch(() => {});
          adminData = {
            id: admin._id.toString(),
            email: admin.email,
            role: admin.role,
            name: admin.name,
          };
        }
      }
    } catch (dbErr) {
      console.warn('DB connection failed during login, checking fallback credentials:', dbErr);
    }

    // Fallback credentials check if DB is down or default admin
    if (!adminData) {
      if (cleanEmail === 'admin@azipstore.lk' && password === 'admin123') {
        adminData = {
          id: 'default-admin-id',
          email: 'admin@azipstore.lk',
          role: 'superadmin',
          name: 'AZip Admin',
        };
      }
    }

    if (!adminData) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = await signToken(adminData);

    // Set HttpOnly cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      admin: adminData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
