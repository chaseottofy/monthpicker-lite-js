/**
 * @jest-environment jsdom
 */

import {
  describe,
  expect,
  test,
  beforeAll
} from '@jest/globals';

import {
  waitFor,
} from '@testing-library/dom';

import '@testing-library/jest-dom';

import {
  MonthPickerInterface,
  PickerConstantsInterface,
} from '../src/models/interfaces';

import MonthPicker from '../src/monthpicker/monthpickerClass';

import pickerConstants from '../src/constants/constants';

const {
  BASE_PICKER_CLASS,
  BASE_INPUT_WRAPPER_CLASS,
  PICKER_DISABLED_CLASS,
  INPUT_WRAPPER_ACTIVE,
} = pickerConstants as PickerConstantsInterface;

const testDate: Date = new Date(2023, 0, 1); // Jan 1, 2023

// const buildRootContainer = (): void => {};
let rootContainer: HTMLElement;
let monthPicker: MonthPickerInterface;
let refMonthPicker: HTMLElement;
let refInputWrapper: HTMLElement;

beforeAll(() => {
  rootContainer = document.createElement('div') as HTMLElement;
  rootContainer.classList.add('rootContainer');
  rootContainer.dataset.testid = 'rootContainer';
  document.body.appendChild(rootContainer);

  monthPicker = new MonthPicker(
    rootContainer,
    testDate,
    [(date: Date) => console.log(date)],
    'dark',
    'month dd, yyyy',
    true,
    false,
    false,
  ) as MonthPickerInterface;

  refMonthPicker = rootContainer?.querySelector(`.${BASE_PICKER_CLASS}`) as HTMLElement;
  refInputWrapper = rootContainer?.querySelector(`.${BASE_INPUT_WRAPPER_CLASS}`) as HTMLElement;
});

describe('jsdom', () => {
  test('monthpicker populates on load', async () => {
    const docHasInputWrapper = refInputWrapper !== null;
    expect(docHasInputWrapper).toBe(true);
    expect(rootContainer).toMatchSnapshot();
  });

  // open
  test('monthpicker-method: open', async () => {
    monthPicker.open();
    await waitFor(() => {
      expect(refMonthPicker.classList.contains(PICKER_DISABLED_CLASS)).toBe(false);
      expect(refInputWrapper.classList.contains(INPUT_WRAPPER_ACTIVE)).toBe(true);
    });
  });

  // close
  test('monthpicker-method: close', async () => {
    monthPicker.close();
    await waitFor(() => {
      expect(refMonthPicker.classList.contains(PICKER_DISABLED_CLASS)).toBe(true);
      expect(refInputWrapper.classList.contains(INPUT_WRAPPER_ACTIVE)).toBe(false);
    });
  });

  // open
  test('monthpicker-method: toggle', async () => {
    monthPicker.toggle();
    await waitFor(() => {
      expect(refMonthPicker.classList.contains(PICKER_DISABLED_CLASS)).toBe(false);
      expect(refInputWrapper.classList.contains(INPUT_WRAPPER_ACTIVE)).toBe(true);
    });
  });

  // getRootContainer
  test('monthpicker-method: getRootContainer', async () => {
    expect(monthPicker.getRootContainer()).toBe(rootContainer);
  });

  // getDate - getDateArray - getDateFormatted
  test('monthpicker-method: date getters', async () => {
    expect(
      monthPicker.getDate().getTime()
    ).toEqual(testDate.getTime());
    expect(monthPicker.getDateArray()).toEqual([2023, 1, 1]);
    expect(monthPicker.getDateFormatted()).toBe('January 1st, 2023');
  });

  // getTheme
  test('monthpicker-method: getTheme', async () => {
    expect(monthPicker.getTheme()).toBe('dark');
  });

  // getFormat
  test('monthpicker-method: getFormat', async () => {
    expect(monthPicker.getFormat()).toBe('month dd, yyyy');
  });

  // get closeOnSelect - onlyShowCurrentMonth - alignPickerMiddle
  test('monthpicker-method: getFormat', async () => {
    expect(monthPicker.getCloseOnSelect()).toBe(true);
    expect(monthPicker.getOnlyShowCurrentMonth()).toBe(false);
    expect(monthPicker.getAlignPickerMiddle()).toBe(false);
  });
});
