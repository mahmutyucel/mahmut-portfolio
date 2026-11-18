import 'server-only';
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'mahmut_admin_session';
const SESSION_DURATION = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET en az 32 karakter olmalidir.');
  }
  return secret;
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('hex');
}

export async function checkAdminCredentials(username: string, password: string) {
  return Boolean(
    process.env.ADMIN_USERNAME && 
    process.env.ADMIN_PASSWORD && 
    username === process.env.ADMIN_USERNAME && 
    password === process.env.ADMIN_PASSWORD
  );
}

export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_DURATION;
  const value = String(expires);
  const signature = sign(value);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value + '.' + signature, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION
  });
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  
  const [expires, signature] = parts;
  if (!/^\d+$/.test(expires) || Number(expires) < Math.floor(Date.now() / 1000)) return false;
  
  const expected = Buffer.from(sign(expires), 'hex');
  const actual = Buffer.from(signature, 'hex');
  
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}