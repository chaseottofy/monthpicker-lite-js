import pickerConstants from '../constants/constants';

import { PickerConstantsInterface } from '../models/interfaces';

const {
  INPUT_FORMATS,
  MONTHS,
  DEFAULT_FORMAT
} = pickerConstants as PickerConstantsInterface;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getOrdinal(num: number) {
  const int = Math.round(num);
  if (Number.isNaN(int)) return null;
  const digits = [int % 10, int % 100];
  const ordinals = ['st', 'nd', 'rd', 'th'];
  const oPattern = [1, 2, 3, 4];
  const tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
  return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
    ? int + ordinals[digits[0] - 1]
    : int + ordinals[3];
}

export function isDateValid(val: Date) {
  return !Number.isNaN(new Date(val).valueOf());
}

export function daysInMonth(Y: number, M: number) { return new Date(Y, M, 0).getDate(); }

export function getDateArray(D: Date) { return [D.getFullYear(), D.getMonth() + 1, D.getDate()]; }

export function formatMonthYear(D: Date) {
  return `${MONTHS[D.getMonth()]} ${D.getFullYear()}`;
}

export function parseDateString(str: string) {
  const [Y, M, D] = str.split('-').map((x) => Number.parseInt(x, 10));
  return new Date(Y, M - 1, D);
}

export function validateInputFormat(format: string) {
  return INPUT_FORMATS.includes(format.toLowerCase());
}

export function formatDateForInput(date: Date, inputFormat: string) {
  const format = inputFormat && typeof inputFormat === 'string'
    ? inputFormat.toLowerCase()
    : DEFAULT_FORMAT;

  // formatDay / formatYear
  const [fD, fY] = ['dd', 'yyyy'];

  // formatMonth: 'month', 'mth', or 'mm'
  let fM = 'month';
  if (format.includes('mth')) { fM = 'mth'; }
  if (format.includes('mm')) { fM = 'mm'; }

  const [year, month, day] = getDateArray(date);
  const MFormatLG = fM === 'month';
  const MFormatMD = fM === 'mth';
  const MFormatSM = fM === 'mm';
  let D: number | string = day < 10 ? `0${day}` : day;
  if (MFormatMD || MFormatLG) {
    D = getOrdinal(day) as string;
  }
  let M: any;
  if (MFormatLG) { M = MONTHS[month - 1]; }
  if (MFormatMD) { M = MONTHS[month - 1].slice(0, 3); }
  if (MFormatSM) { M = month < 10 ? `0${month}` : month; }

  return format.replace(fD, D as string).replace(fM, M).replace(fY, year as any);
}

export function validateSelectedDay(selectedDay: number, currentMonth: number, currentYear: number): number {
  const daysInMonth = (month: number, year: number): number => {
    switch (month) {
      case 2: // February
        return isLeapYear(year) ? 29 : 28;
      case 4: case 6: case 9: case 11: // April, June, September, November
        return 30;
      default:
        return 31;
    }
  };

  const totalDays = daysInMonth(currentMonth, currentYear);
  if (selectedDay > totalDays) {
    return totalDays;
  }

  return selectedDay;
}