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
} from '../src/helpers/date-helpers';

import pickerConstants from '../src/constants/constants';

import { PickerConstantsInterface } from '../src/models/interfaces';

import {
  testListOfDays,
  testOrdinalArr,
  testFormatArr
} from './test.constants';

const {
  INPUT_FORMATS,
  MONTHS
} = pickerConstants as PickerConstantsInterface;

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
    for (const [index, str] of testOrdinalArr.entries()) {
      expect(getOrdinal(index + 1)).toBe(str);
    }
    // testOrdinalArr.forEach((str, index) => {
    //   expect(getOrdinal(index + 1)).toBe(str);
    // });
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
    // invalid date string
    expect(isDateValid(new Date('foo'))).toBe(false);
    // out of range
    expect(isDateValid(new Date(1959, 1, 1))).toBe(false);
    // invalid space in date string
    expect(isDateValid(new Date('1995-12-17 T03:24:00'))).toBe(false);
  });
});

describe('daysInMonth', () => {
  test('returns correct number of days in month on a normal year', () => {
    // Non-leap year
    for (const [index, day] of testListOfDays.entries()) {
      expect(daysInMonth(2021, index + 1)).toBe(day);
    }
  });

  test('returns correct number of days in february on a leap year', () => {
    // Leap year
    expect(daysInMonth(2020, 2)).toBe(29);
  });
});

describe('getDateArray', () => {
  test('returns date object as [year, month, day]', () => {
    for (let i = 0; i < 12; i++) {
      expect(
        getDateArray(new Date(2023, i, testListOfDays[i]))
      ).toEqual([2023, i + 1, testListOfDays[i]]);
    }
  });
});

describe('parseDateString', () => {
  test('parses string and returns equivalent Date Object', () => {
    // Test first and last day of each month
    for (let i = 0; i < 9; i++) {
      expect(parseDateString(`2023-0${i + 1}-${testListOfDays[i]}`)).toEqual(
        new Date(2023, i, testListOfDays[i])
      );
      expect(parseDateString(`2023-0${i + 1}-01`)).toEqual(new Date(2023, i, 1));
    }
    for (let i = 9; i < 12; i++) {
      expect(parseDateString(`2023-${i + 1}-${testListOfDays[i]}`)).toEqual(
        new Date(2023, i, testListOfDays[i])
      );
      expect(parseDateString(`2023-${i + 1}-01`)).toEqual(new Date(2023, i, 1));
    }
  });
});

describe('formatDateForInput', () => {
  test('returns correct formatted date from date object and format option', () => {
    const date: Date = new Date(2023, 0, 9);
    for (const [index, format] of INPUT_FORMATS.entries()) {
      expect(formatDateForInput(date, format)).toEqual(testFormatArr[index]);
    }
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
