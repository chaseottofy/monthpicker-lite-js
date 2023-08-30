import pickerConstants from '../constants/constants';

import { PickerConstantsInterface } from '../models/interfaces';

const {
  INPUT_FORMATS,
  MONTHS,
  DEFAULT_FORMAT,
} = pickerConstants as PickerConstantsInterface;

/**
 * isLeapYear
 * @param year number - Year to test
 * @returns boolean - True if leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * getDaysInMonth
 * @param month number - Month to test (1-12)
 * @param year number  - Year to test
 * @returns number     - Number of days in month
 */
export function getDaysInMonth(month: number, year: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if (month === 4 || month === 6 || month === 9 || month === 11) return 30;
  return 31;
}

/**
 * getOrdinal
 * @param num - day of month
 * @returns string - day of month with ordinal (e.g. '1st', '2nd', '3rd', '4th', etc.)
 */
export function getOrdinal(num: number) {
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

/**
 * isDateValid - Must be valid date object with a
 * positive valueOf (within 60 or so years)
 *
 * @param val Date to validate
 * @returns boolean
 */
export function isDateValid(val: Date) {
  const tstNum: number = new Date(val).valueOf();
  return tstNum > 0 && !Number.isNaN(tstNum) && val instanceof Date;
}

/**
 * daysInMonth
 * @param Y number - Year
 * @param M number - Month
 * @returns number - Number of days in month
 */
export function daysInMonth(Y: number, M: number) { return new Date(Y, M, 0).getDate(); }

/**
 * getDateArray
 * @param D Date - Date to convert to array
 * @returns number[] - Array of [year, month, day]
 */
export function getDateArray(D: Date) { return [D.getFullYear(), D.getMonth() + 1, D.getDate()]; }

/**
 * formatMonthYear
 * @param D Date - Date to format
 * @returns string - Formatted date string (e.g. 'January 2021')
 */
export function formatMonthYear(D: Date) {
  return `${MONTHS[D.getMonth()]} ${D.getFullYear()}`;
}

/**
 * parseDateString
 * @param str string - Date string (e.g. '2021-01-01')
 * @returns Date - Date object from string
 */
export function parseDateString(str: string) {
  const [Y, M, D] = str.split('-').map((x) => Number.parseInt(x, 10));
  return new Date(Y, M - 1, D);
}

/**
 * validateInputFormat
 * @param format string - Format to validate (e.g. 'dd/mm/yyyy')
 * @returns boolean - True if format exists in predefined INPUT_FORMATS array
 */
export function validateInputFormat(format: string) {
  return INPUT_FORMATS.includes(format.toLowerCase());
}

/**
 * formatDateForInput
 * @param date Date - Date Object to format
 * @param inputFormat string - (e.g. 'dd/mm/yyyy')
 * @returns string - formatted date string (e.g. '01/01/2021')
 */
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

/**
 * validateSelectedDay - Ensures selected day is not greater than the number of days in the month
 *
 * Set the selected day to the maximum number of days in the new month only
 * if that new month has fewer days than the selected day
 *
 * @param selectedDay number - selected day
 * @param currentMonth number - current month
 * @param currentYear number - current year
 * @returns number - largest of selected day or number of days in current month
 */
export function validateSelectedDay(
  selectedDay: number,
  currentMonth: number,
  currentYear: number,
): number {
  const totalDays = getDaysInMonth(currentMonth, currentYear);
  return selectedDay > totalDays ? totalDays : selectedDay;
}
