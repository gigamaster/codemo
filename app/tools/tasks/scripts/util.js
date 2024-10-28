/**
 * @param {Date} date
 * @returns {string}
 */
export function formatDateId(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const ys = y.toString().padStart(4, '0');
  const ms = m.toString().padStart(2, '0');
  const ds = d.toString().padStart(2, '0');

  return `${ys}-${ms}-${ds}`;
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const m = formatMonth(date);
  const d = formatDayOfMonth(date);
  const y = date.getFullYear().toString().padStart(4, '0');

  return `${m} ${d} ${y}`;
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function formatDayOfMonth(date) {
  const d = date.getDate();
  const t = d % 10;

  return d === 11 || d === 12 || d === 13
    ? `${d}th`
    : t === 1
      ? `${d}st`
      : t === 2
        ? `${d}nd`
        : t === 3
          ? `${d}rd`
          : `${d}th`;
}

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * @param {Date} date
 * @returns {string}
 */
export function formatDayOfWeek(date) {
  return DAY_NAMES[date.getDay()];
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * @param {Date} date
 * @returns {string}
 */
export function formatMonth(date) {
  return MONTH_NAMES[date.getMonth()];
}

/**
 * https://developer.mozilla.org/en-US/docs/Glossary/Base64
 * @param {BlobPart} input
 */
export async function toDataURL(input, type) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(new File([input], '', { type }));
  });
}
