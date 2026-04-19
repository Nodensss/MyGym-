import type { Exercise } from '@/lib/types';

export const DEFAULT_PROGRAM: { name: string; scheme: string; exercises: Exercise[] } = {
  name: 'Full Body - возвращение',
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
