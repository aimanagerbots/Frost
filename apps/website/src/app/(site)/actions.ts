'use server';

import { cookies } from 'next/headers';

export async function verifyPassword(password: string) {
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    // No password set — allow entry
    (await cookies()).set('site-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return { success: true };
  }

  if (password === sitePassword) {
    (await cookies()).set('site-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return { success: true };
  }

  return { success: false };
}
