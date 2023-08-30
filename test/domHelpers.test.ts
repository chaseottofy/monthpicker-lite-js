/**
 * @jest-environment jsdom
 */

import {
  describe,
  expect,
  test,
  beforeEach
  // beforeAll
} from '@jest/globals';

// import {
//   waitFor,
// } from '@testing-library/dom';

import '@testing-library/jest-dom';

// import userEvent from '@testing-library/user-event';

import {
  testDomDate,
  testDomDate2,
  testDomCallback,
} from './testConstants';

import {
  MonthPickerInterface,
} from '../src/models/interfaces';

import MonthPicker from '../src/monthpicker/monthpickerClass';

// import pickerConstants from '../src/constants/constants';
// const {
//   BASE_PICKER_CLASS,
//   BASE_INPUT_WRAPPER_CLASS,
//   // PICKER_DISABLED_CLASS,
//   // INPUT_WRAPPER_ACTIVE,
// } = pickerConstants as PickerConstantsInterface;

const rootContainer = document.createElement('div') as HTMLElement;
rootContainer.classList.add('rootContainer');

const rootContainer2 = document.createElement('div') as HTMLElement;
rootContainer2.classList.add('rootContainer2');

document.body.append(rootContainer, rootContainer2);

const monthPicker = new MonthPicker(
  rootContainer,
  testDomDate,
  [testDomCallback],
  'dark',
  'month dd, yyyy',
  true,
  false,
  false,
) as MonthPickerInterface;

beforeEach(() => {
  monthPicker.setRootContainer(rootContainer);
  monthPicker.setDate(testDomDate);
  monthPicker.setFormat('month dd, yyyy');
  monthPicker.setCallbacks([testDomCallback]);
  monthPicker.setTheme('dark');
  monthPicker.setCloseOnSelect(true);
  monthPicker.setOnlyShowCurrentMonth(false);
  monthPicker.setAlignPickerMiddle(false);
  monthPicker.init();
});

describe('jsdom - monthPicker public methods', () => {

  // implicitly instantiated
  test('monthpicker populates on load', () => {
    expect(monthPicker.getInstances().inputWrapper !== null).toBe(true);
  });

  // open & close
  test('monthpicker-method: open', () => {
    monthPicker.open();
    expect(
      monthPicker.getMonthPickerInstance()?.dataset.pickerOpen === 'true'
    ).toBe(true);
  });

  // getDate - getDateArray - getDateFormatted
  test('monthpicker-method: date getters', () => {
    expect(monthPicker.getDate().getTime()).toEqual(testDomDate.getTime());
    expect(monthPicker.getDateArray()).toEqual([2023, 1, 1]);
    expect(monthPicker.getDateFormatted()).toBe('January 1st, 2023');
  });

  // setDate
  test('monthpicker-method: setDate', () => {
    monthPicker.setDate(testDomDate2);
    expect(monthPicker.getDate().getTime()).toEqual(testDomDate2.getTime());
  });

  // set/get Format
  test('monthpicker-method: setFormat', () => {
    monthPicker.setFormat('month dd yyyy');
    expect(monthPicker.getFormat()).toBe('month dd yyyy');
  });

  // set/get Theme
  test('monthpicker-method: setTheme', () => {
    monthPicker.setTheme('light');
    expect(monthPicker.getTheme()).toBe('light');
  });

  /**
   * set/get methods with boolean values
   * closeOnSelect
   * onlyShowCurrentMonth
   * alignPickerMiddle
   */
  test('monthpicker-method: set booleans', () => {
    monthPicker.setCloseOnSelect(false);
    monthPicker.setOnlyShowCurrentMonth(true);
    monthPicker.setAlignPickerMiddle(true);

    expect(monthPicker.getCloseOnSelect()).toBe(false);
    expect(monthPicker.getOnlyShowCurrentMonth()).toBe(true);
    expect(monthPicker.getAlignPickerMiddle()).toBe(true);
  });

  // set/get/add callbacks
  test('monthpicker-method: setCallbacks - addCallback', () => {
    monthPicker.addCallback(() => console.log('test'));
    expect(monthPicker.getCallbacks().length).toBe(2);

    monthPicker.setCallbacks([]);
    expect(monthPicker.getCallbacks().length).toBe(0);

    monthPicker.addCallback(testDomCallback);
    expect(monthPicker.getCallbacks().length).toBe(1);
  });

  // destroy & re-init
  test('monthpicker-method: destroy', () => {
    monthPicker.destroy();
    expect(rootContainer.innerHTML === '').toBe(true);
    monthPicker.init();
  });

  // test('monthpicker: close on escape', () => {
  // });
});
