import type { Exercise, WorkoutKind, WorkoutProgram } from '@/lib/types';

export const DEFAULT_PROGRAM: WorkoutProgram = {
  kind: 'gym',
  name: 'Full Body - возвращение',
  shortName: 'Full Body',
  scheme: '3 x 12-15 повторений · отдых 1.5-2 мин',
  exercises: [
    {
      id: 'bench',
      name: 'Жим штанги лёжа',
      group: 'Грудь',
      target: '30 кг',
      hint: 'Хват средний, локти 45°',
      unit: 'кг',
      step: 2.5,
      defaultW: 30,
      defaultR: 12
    },
    {
      id: 'lat_pull',
      name: 'Тяга верхнего блока',
      group: 'Спина',
      target: '6 плиток',
      hint: 'Широкий хват, тянем лопатками',
      unit: 'плиток',
      step: 1,
      defaultW: 6,
      defaultR: 12
    },
    {
      id: 'row',
      name: 'Тяга горизонт. блока',
      group: 'Спина',
      target: 'лёгкий стек',
      hint: 'Тянуть к животу, лопатки сводить',
      unit: 'плиток',
      step: 1,
      defaultW: 3,
      defaultR: 12,
      isNew: true
    },
    {
      id: 'shoulder_press',
      name: 'Жим гантелей сидя',
      group: 'Плечи',
      target: '6 кг/рука',
      hint: 'Не заводить руки за голову!',
      unit: 'кг',
      step: 1,
      defaultW: 6,
      defaultR: 12
    },
    {
      id: 'leg_press',
      name: 'Жим ногами',
      group: 'Ноги',
      target: '+10 кг',
      hint: 'Колени до конца не выпрямлять',
      unit: 'кг',
      step: 5,
      defaultW: 10,
      defaultR: 12
    },
    {
      id: 'leg_ext',
      name: 'Разгибания ног',
      group: 'Ноги',
      target: '15 кг',
      hint: '',
      unit: 'кг',
      step: 2.5,
      defaultW: 15,
      defaultR: 15
    },
    {
      id: 'biceps',
      name: 'Бицепс',
      group: 'Руки',
      target: '15 кг',
      hint: 'Закрепить вес после крепатуры',
      unit: 'кг',
      step: 2.5,
      defaultW: 15,
      defaultR: 15
    },
    {
      id: 'leg_raise',
      name: 'Подъём ног в висе',
      group: 'Пресс',
      target: '3 x 20',
      hint: '1 повтор = поджатые + прямые',
      unit: 'раз',
      step: 1,
      defaultW: 0,
      defaultR: 15,
      noWeight: true
    }
  ]
};

export const BODYWEIGHT_PROGRAM: WorkoutProgram = {
  kind: 'bodyweight',
  name: 'Вне зала - база',
  shortName: 'Вне зала',
  scheme: '3 подхода · подтягивания и отжимания · отдых 1.5-2 мин',
  exercises: [
    {
      id: 'pull_up',
      name: 'Подтягивания',
      group: 'Спина',
      target: '3 подхода качественно',
      hint: 'Полная амплитуда, без рывков',
      unit: 'раз',
      step: 1,
      defaultW: 0,
      defaultR: 5,
      noWeight: true
    },
    {
      id: 'push_up',
      name: 'Отжимания',
      group: 'Грудь',
      target: '3 подхода ровно',
      hint: 'Корпус прямой, грудь ниже локтей',
      unit: 'раз',
      step: 1,
      defaultW: 0,
      defaultR: 12,
      noWeight: true
    }
  ]
};

export const WORKOUT_PROGRAMS: Record<WorkoutKind, WorkoutProgram> = {
  gym: DEFAULT_PROGRAM,
  bodyweight: BODYWEIGHT_PROGRAM
};

export const ALL_EXERCISES: Exercise[] = Object.values(WORKOUT_PROGRAMS).flatMap((program) => program.exercises);

export function getProgramByKind(kind?: WorkoutKind | string | null) {
  return WORKOUT_PROGRAMS[kind as WorkoutKind] ?? DEFAULT_PROGRAM;
}

export function getExerciseById(exerciseId: string) {
  return ALL_EXERCISES.find((exercise) => exercise.id === exerciseId);
}
