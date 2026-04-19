import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { Workout } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const active = await prisma.activeWorkout.findUnique({
      where: { id: 'active' }
    });

    return NextResponse.json(active ? { data: active.data } : null);
  } catch {
    return NextResponse.json({ error: 'Failed to load active workout' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { data?: Workout };

    if (!body.data) {
      return NextResponse.json({ error: 'data is required' }, { status: 400 });
    }

    const active = await prisma.activeWorkout.upsert({
      where: { id: 'active' },
      update: { data: body.data as unknown as Prisma.InputJsonValue },
      create: { id: 'active', data: body.data as unknown as Prisma.InputJsonValue }
    });

    return NextResponse.json({ data: active.data });
  } catch {
    return NextResponse.json({ error: 'Failed to save active workout' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.activeWorkout.deleteMany({
      where: { id: 'active' }
    });

    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Failed to clear active workout' }, { status: 500 });
  }
}
