import { describe, expect, test } from '@jest/globals';

import {
  isLeapYear,
  getOrdinal,
  isDateValid,
  daysInMonth,
  getDateArray,
  parseDateString,
  formatDateForInput,
  formatMonthYear,
  validateSelectedDay,
} from '../src/helpers/dateHelpers';

import pickerConstants from '../src/constants/constants';

import { PickerConstantsInterface } from '../src/models/interfaces';

const {
  INPUT_FORMATS,
  MONTHS
} = pickerConstants as PickerConstantsInterface;

const listOfDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

describe('isLeapYear', () => {
  test('returns true for leap year', () => {
    expect(isLeapYear(2020)).toBe(true);
  });

  test('returns false for non-leap year', () => {
    expect(isLeapYear(2021)).toBe(false);
  });
});

describe('getOrdinal', () => {
  test('returns number with correct ordinal as string', () => {
    const ordinalTstArr: string[] = [
      '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
      '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th',
      '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th',
      '29th', '30th', '31st'
    ];
    ordinalTstArr.forEach((str, index) => {
      expect(getOrdinal(index + 1)).toBe(str);
    });
  });
});

describe('isDateValid', () => {
  test('returns true for valid date', () => {
    expect(isDateValid(new Date())).toBe(true);
    expect(isDateValid(new Date(2023, 1, 1))).toBe(true);
    expect(isDateValid(new Date('2023-01-01'))).toBe(true);
    expect(isDateValid(new Date('2023-01-01T00:00:00'))).toBe(true);
    expect(isDateValid(new Date('1995-12-17T03:24:00'))).toBe(true);
  });

  test('returns false for invalid date', () => {
    expect(isDateValid(new Date('foo'))).toBe(false);
    expect(isDateValid(new Date(1959, 1, 1))).toBe(false);
    expect(isDateValid(new Date('1995-12-17 T03:24:00'))).toBe(false);
  });
});

describe('daysInMonth', () => {
  test('returns correct number of days in month on a normal year', () => {
    listOfDays.forEach((day, index) => {
      expect(daysInMonth(2021, index + 1)).toBe(day);
    });
  });

  test('returns correct number of days in february on a leap year', () => {
    expect(daysInMonth(2020, 2)).toBe(29);
  });
});

describe('getDateArray', () => {
  test('returns date object as [year, month, day]', () => {
    for (let i = 0; i < 12; i++) {
      expect(
        getDateArray(new Date(2023, i, listOfDays[i]))
      ).toEqual([2023, i + 1, listOfDays[i]]);
    }
  });
});

describe('parseDateString', () => {
  test('parses string and returns equivalent Date Object', () => {
    // Test first and last day of each month
    for (let i = 0; i < 9; i++) {
      expect(parseDateString(`2023-0${i + 1}-${listOfDays[i]}`)).toEqual(new Date(2023, i, listOfDays[i]));
      expect(parseDateString(`2023-0${i + 1}-01`)).toEqual(new Date(2023, i, 1));
    }
    for (let i = 9; i < 12; i++) {
      expect(parseDateString(`2023-${i + 1}-${listOfDays[i]}`)).toEqual(new Date(2023, i, listOfDays[i]));
      expect(parseDateString(`2023-${i + 1}-01`)).toEqual(new Date(2023, i, 1));
    }
  });
});

describe('formatDateForInput', () => {
  test('returns correct formatted date from date object and format option', () => {
    const date: Date = new Date(2023, 0, 9);
    const tstFormatArr: string[] = [
      '09012023',
      '09/01/2023',
      '01/09/2023',
      '09-01-2023',
      '01-09-2023',
      'January 9th, 2023',
      'January 9th 2023',
      'Jan 9th 2023',
      'Jan 9th, 2023',
    ];
    INPUT_FORMATS.forEach((format, index) => {
      expect(formatDateForInput(date, format)).toEqual(tstFormatArr[index]);
    });
  });
});

describe('formatMonthYear', () => {
  test('returns correct formatted month and year from date object', () => {
    for (let i = 0; i < 12; i++) {
      expect(formatMonthYear(new Date(2023, i, 1))).toEqual(`${MONTHS[i]} 2023`);
    }
  });
});

describe('validateSelectedDay', () => {
  test('Set the selected day to the maximum number of days in the new month only if that new month has fewer days than the selected day', () => {
    // Leap year
    expect(validateSelectedDay(31, 2, 2020)).toBe(29);

    // Non-leap year
    expect(validateSelectedDay(31, 2, 2023)).toBe(28);
    expect(validateSelectedDay(31, 4, 2023)).toBe(30);
    expect(validateSelectedDay(31, 6, 2023)).toBe(30);
    expect(validateSelectedDay(31, 9, 2023)).toBe(30);
    expect(validateSelectedDay(31, 11, 2023)).toBe(30);
  });
});
