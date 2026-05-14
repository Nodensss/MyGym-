import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureWorkout11Date } from '@/lib/migrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const fixed = await ensureWorkout11Date();
    return NextResponse.json({ ok: true, at: new Date().toISOString(), migrationFixed: fixed });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
