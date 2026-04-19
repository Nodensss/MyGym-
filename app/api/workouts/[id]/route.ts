import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { serializeWorkout, setsToCreateInput } from '@/lib/workout-mapper';
import type { Workout } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

function parseDate(value?: string) {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00.000Z`);
}

function includeSets() {
  return {
    sets: {
      orderBy: [{ exerciseId: 'asc' as const }, { setIndex: 'asc' as const }]
    }
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: params.id },
      include: includeSets()
    });

    if (!workout) return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    return NextResponse.json(serializeWorkout(workout));
  } catch {
    return NextResponse.json({ error: 'Failed to load workout' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const body = (await request.json()) as Partial<Workout>;
    const data: Prisma.WorkoutUpdateInput = {};

    if (body.number !== undefined) data.number = body.number;
    if (body.label !== undefined) data.label = body.label;
    if (body.date !== undefined) data.date = parseDate(body.date);
    if (body.warmup !== undefined) {
      data.warmupTime = body.warmup.time ?? null;
      data.warmupDistance = body.warmup.distance ?? null;
    }
    if (body.watch !== undefined) {
      data.watchDuration = body.watch.duration ?? null;
      data.watchCalories = body.watch.calories ?? null;
      data.watchAvgHr = body.watch.avgHr ?? null;
      data.watchMaxHr = body.watch.maxHr ?? null;
    }
    if (body.notes !== undefined) data.notes = body.notes || null;
    if (body.sets !== undefined) {
      data.sets = {
        deleteMany: {},
        create: setsToCreateInput(body.sets)
      };
    }

    const updated = await prisma.workout.update({
      where: { id: params.id },
      data,
      include: includeSets()
    });

    return NextResponse.json(serializeWorkout(updated));
  } catch {
    return NextResponse.json({ error: 'Failed to update workout' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await prisma.workout.delete({
      where: { id: params.id }
    });

    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete workout' }, { status: 500 });
  }
}
