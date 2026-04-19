import type { Workout } from '@/lib/types';

export const INITIAL_HISTORY: Workout[] = [
  {
    id: 'w1',
    kind: 'gym',
    number: 1,
    date: '2026-04-01',
    label: 'Тренировка #1',
    warmup: { time: 8, distance: 1.5 },
    sets: {
      bench: [
        { w: 20, r: 12 },
        { w: 20, r: 12 },
        { w: 20, r: 12 }
      ],
      lat_pull: [
        { w: 5, r: 12 },
        { w: 5, r: 12 },
        { w: 5, r: 12 }
      ],
      shoulder_press: [
        { w: 5, r: 12 },
        { w: 5, r: 12 },
        { w: 5, r: 12 }
      ],
      leg_press: [
        { w: 0, r: 12 },
        { w: 0, r: 12 },
        { w: 0, r: 12 }
      ],
      leg_ext: [
        { w: 10, r: 12 },
        { w: 10, r: 12 },
        { w: 10, r: 12 }
      ],
      biceps: [
        { w: 10, r: 12 },
        { w: 10, r: 12 },
        { w: 10, r: 12 }
      ],
      leg_raise: [
        { w: 0, r: 20 },
        { w: 0, r: 20 },
        { w: 0, r: 20 }
      ]
    },
    watch: { duration: 0, calories: 0, avgHr: 0, maxHr: 0 },
    notes: 'Первая тренировка после перерыва'
  },
  {
    id: 'w2',
    kind: 'gym',
    number: 2,
    date: '2026-04-07',
    label: 'Тренировка #2',
    warmup: { time: 6, distance: 0.8 },
    sets: {
      bench: [
        { w: 20, r: 12 },
        { w: 30, r: 12 },
        { w: 30, r: 12 }
      ],
      lat_pull: [
        { w: 5, r: 12 },
        { w: 5, r: 12 },
        { w: 6, r: 12 }
      ],
      shoulder_press: [
        { w: 6, r: 12 },
        { w: 6, r: 12 },
        { w: 6, r: 12 }
      ],
      leg_press: [
        { w: 10, r: 12 },
        { w: 10, r: 12 },
        { w: 10, r: 12 }
      ],
      leg_ext: [
        { w: 10, r: 12 },
        { w: 15, r: 12 },
        { w: 15, r: 12 }
      ],
      biceps: [
        { w: 25, r: 12 },
        { w: 25, r: 12 },
        { w: 25, r: 12 }
      ],
      leg_raise: [
        { w: 0, r: 20 },
        { w: 0, r: 20 },
        { w: 0, r: 20 }
      ]
    },
    watch: { duration: 0, calories: 0, avgHr: 0, maxHr: 0 },
    notes: 'Переборщил с бицепсом — крепатура!'
  },
  {
    id: 'w3',
    kind: 'gym',
    number: 3,
    date: '2026-04-11',
    label: 'Тренировка #3',
    warmup: { time: 8, distance: 2.25 },
    sets: {
      bench: [
        { w: 30, r: 12 },
        { w: 30, r: 12 },
        { w: 30, r: 12 }
      ],
      lat_pull: [
        { w: 6, r: 12 },
        { w: 6, r: 12 },
        { w: 6, r: 12 }
      ],
      shoulder_press: [
        { w: 6, r: 12 },
        { w: 6, r: 12 },
        { w: 6, r: 12 }
      ],
      leg_press: [
        { w: 10, r: 12 },
        { w: 10, r: 12 },
        { w: 10, r: 12 }
      ],
      leg_ext: [
        { w: 15, r: 15 },
        { w: 15, r: 15 },
        { w: 15, r: 15 }
      ],
      biceps: [
        { w: 15, r: 15 },
        { w: 15, r: 15 },
        { w: 15, r: 15 }
      ],
      leg_raise: [
        { w: 0, r: 15 },
        { w: 0, r: 15 },
        { w: 0, r: 10 }
      ]
    },
    watch: { duration: 187, calories: 1316, avgHr: 104, maxHr: 144 },
    notes: 'Бицепс на 15 кг — норм, крепатуры нет'
  }
];
