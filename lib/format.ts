const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'
];

export function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatShortDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}
