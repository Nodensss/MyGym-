import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const WORKOUTS = [
  {
    number: 1,
    label: 'Тренировка #1',
    date: '2026-04-01',
    warmupTime: 8,
    warmupDistance: 1.5,
    notes: 'Первая тренировка после перерыва',
    sets: {
      bench: [
        [20, 12],
        [20, 12],
        [20, 12]
      ],
      lat_pull: [
        [5, 12],
        [5, 12],
        [5, 12]
      ],
      shoulder_press: [
        [5, 12],
        [5, 12],
        [5, 12]
      ],
      leg_press: [
        [0, 12],
        [0, 12],
        [0, 12]
      ],
      leg_ext: [
        [10, 12],
        [10, 12],
        [10, 12]
      ],
      biceps: [
        [10, 12],
        [10, 12],
        [10, 12]
      ],
      leg_raise: [
        [0, 20],
        [0, 20],
        [0, 20]
      ]
    }
  },
  {
    number: 2,
    label: 'Тренировка #2',
    date: '2026-04-07',
    warmupTime: 6,
    warmupDistance: 0.8,
    notes: 'Переборщил с бицепсом — крепатура!',
    sets: {
      bench: [
        [20, 12],
        [30, 12],
        [30, 12]
      ],
      lat_pull: [
        [5, 12],
        [5, 12],
        [6, 12]
      ],
      shoulder_press: [
        [6, 12],
        [6, 12],
        [6, 12]
      ],
      leg_press: [
        [10, 12],
        [10, 12],
        [10, 12]
      ],
      leg_ext: [
        [10, 12],
        [15, 12],
        [15, 12]
      ],
      biceps: [
        [25, 12],
        [25, 12],
        [25, 12]
      ],
      leg_raise: [
        [0, 20],
        [0, 20],
        [0, 20]
      ]
    }
  },
  {
    number: 3,
    label: 'Тренировка #3',
    date: '2026-04-11',
    warmupTime: 8,
    warmupDistance: 2.25,
    watchDuration: 187,
    watchCalories: 1316,
    watchAvgHr: 104,
    watchMaxHr: 144,
    notes: 'Бицепс на 15 кг — норм, крепатуры нет',
    sets: {
      bench: [
        [30, 12],
        [30, 12],
        [30, 12]
      ],
      lat_pull: [
        [6, 12],
        [6, 12],
        [6, 12]
      ],
      shoulder_press: [
        [6, 12],
        [6, 12],
        [6, 12]
      ],
      leg_press: [
        [10, 12],
        [10, 12],
        [10, 12]
      ],
      leg_ext: [
        [15, 15],
        [15, 15],
        [15, 15]
      ],
      biceps: [
        [15, 15],
        [15, 15],
        [15, 15]
      ],
      leg_raise: [
        [0, 15],
        [0, 15],
        [0, 10]
      ]
    }
  }
] as const;

async function main() {
  await prisma.activeWorkout.deleteMany();
  await prisma.set.deleteMany();
  await prisma.workout.deleteMany();

  for (const workout of WORKOUTS) {
    await prisma.workout.create({
      data: {
        number: workout.number,
        label: workout.label,
        date: new Date(`${workout.date}T00:00:00.000Z`),
        warmupTime: workout.warmupTime,
        warmupDistance: workout.warmupDistance,
        watchDuration: 'watchDuration' in workout ? workout.watchDuration : null,
        watchCalories: 'watchCalories' in workout ? workout.watchCalories : null,
        watchAvgHr: 'watchAvgHr' in workout ? workout.watchAvgHr : null,
        watchMaxHr: 'watchMaxHr' in workout ? workout.watchMaxHr : null,
        notes: workout.notes,
        sets: {
          create: Object.entries(workout.sets).flatMap(([exerciseId, entries]) =>
            (entries as ReadonlyArray<readonly [number, number]>).map(([weight, reps], setIndex) => ({
              exerciseId,
              setIndex,
              weight,
              reps
            }))
          )
        }
      }
    });
  }

  console.log('Seeded', WORKOUTS.length, 'workouts');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
