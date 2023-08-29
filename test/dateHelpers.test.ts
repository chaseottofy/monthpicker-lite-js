import { describe, expect, test } from '@jest/globals';
import {
  isDateValid,
  daysInMonth,
  getDateArray,
  parseDateString,
} from '../src/helpers/dateHelpers';

describe('isDateValid', () => {
  test('returns true for valid date', () => {
    expect(isDateValid(new Date())).toBe(true);
  });

  test('returns false for invalid date', () => {
    expect(isDateValid(new Date('foo'))).toBe(false);
  });
});

describe('daysInMonth', () => {
  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 2)).toBe(28);
  });

  test('returns correct number of days in leap year', () => {
    expect(daysInMonth(2020, 2)).toBe(29);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 3)).toBe(31);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 4)).toBe(30);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 5)).toBe(31);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 6)).toBe(30);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 7)).toBe(31);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 8)).toBe(31);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 9)).toBe(30);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 10)).toBe(31);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 11)).toBe(30);
  });

  test('returns correct number of days in month', () => {
    expect(daysInMonth(2021, 12)).toBe(31);
  });
});

describe('getDateArray', () => {
  test('returns correct array', () => {
    expect(getDateArray(new Date(2021, 0, 1))).toEqual([2021, 1, 1]);
  });

  test('returns correct date', () => {
    expect(getDateArray(new Date(2021, 1, 2))).toEqual([2021, 2, 2]);
  });
});

describe('parseDateString', () => {
  test('returns correct date', () => {
    expect(parseDateString('2021-01-01')).toEqual(new Date(2021, 0, 1));
  });

  test('returns correct date', () => {
    expect(parseDateString('2021-02-01')).toEqual(new Date(2021, 1, 1));
  });
});