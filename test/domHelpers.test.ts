/**
 * @jest-environment jsdom
 */

// import pickerConstants from '../src/constants/constants';
// const {
//   BASE_PICKER_CLASS,
//   BASE_INPUT_WRAPPER_CLASS,
//   // PICKER_DISABLED_CLASS,
//   // INPUT_WRAPPER_ACTIVE,
// } = pickerConstants as PickerConstantsInterface;
// import userEvent from '@testing-library/user-event';
// import { waitFor } from '@testing-library/dom';

import {
  describe,
  expect,
  test,
  beforeEach
} from '@jest/globals';

import '@testing-library/jest-dom';

import {
  testDomDate,
  testDomDate2,
  testDomCallback,
} from './testConstants';

import {
  getMonthDiff,
} from "./testUtils";

import {
  MonthPickerInterface,
} from '../src/models/interfaces';
import MonthPicker from '../src/monthpicker/monthpickerClass';

// Global constants from '/src/' - namely Classes and Throttle Time
import pickerConstants from '../src/constants/constants';
import {
  PickerConstantsInterface
} from '../src/models/interfaces';
const {
  BASE_THROTTLE,
  BASE_DAY_CLASS,
  MID_MONTH,
  PICKER_NAV_BTN_NEXT_CLASS,
} = pickerConstants as PickerConstantsInterface;

// Create two rootContainers to test setRootContainer() method
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

// Reset monthPicker params before each test
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

  // --Implicit init
  test('monthpicker instantiates upon declaration', () => {
    expect(monthPicker.getInstances().inputWrapper !== null).toBe(true);
  });

  test('PUBLIC METHOD(s): open() | close() | toggle()', () => {
    monthPicker.open();
    const monthPickerTempInst = monthPicker.getMonthPickerInstance() as HTMLElement;
    setTimeout(() => {
      expect(monthPickerTempInst.dataset.pickerOpen === 'true').toBe(true);
      monthPicker.close();
      setTimeout(() => {
        expect(monthPickerTempInst.dataset.pickerOpen === 'false').toBe(true);
        monthPicker.toggle();
        setTimeout(() => {
          expect(monthPickerTempInst.dataset.pickerOpen === 'true').toBe(true);
        }, BASE_THROTTLE);
      }, BASE_THROTTLE);
    }, BASE_THROTTLE);
  });

  test('PUBLIC METHOD(s): getDate() | getDateArray() | getDateFormatted()', () => {
    expect(monthPicker.getDate().getTime()).toEqual(testDomDate.getTime());
    expect(monthPicker.getDateArray()).toEqual([2023, 1, 1]);
    expect(monthPicker.getDateFormatted()).toBe('January 1st, 2023');
  });

  test('PUBLIC METHOD(s): setDate() | getDate()', () => {
    monthPicker.setDate(testDomDate2);
    expect(monthPicker.getDate().getTime()).toEqual(testDomDate2.getTime());
  });

  test('PUBLIC METHOD(s): setFormat() | getFormat()', () => {
    monthPicker.setFormat('month dd yyyy');
    expect(monthPicker.getFormat()).toBe('month dd yyyy');
  });

  test('PUBLIC METHOD(s): setTheme() | getTheme()', () => {
    monthPicker.setTheme('light');
    expect(monthPicker.getTheme()).toBe('light');
  });

  test('PUBLIC METHOD(s): (Boolean) Display/Interactivity Options', () => {
    monthPicker.setCloseOnSelect(false);
    expect(monthPicker.getCloseOnSelect()).toBe(false);

    monthPicker.setOnlyShowCurrentMonth(true);
    expect(monthPicker.getOnlyShowCurrentMonth()).toBe(true);

    monthPicker.setAlignPickerMiddle(true);
    expect(monthPicker.getAlignPickerMiddle()).toBe(true);
  });

  test('PUBLIC METHOD(s): addCallback() | setCallbacks() | getCallbacks()', () => {
    monthPicker.addCallback(() => console.log('test'));
    expect(monthPicker.getCallbacks().length).toBe(2);

    monthPicker.setCallbacks([]);
    expect(monthPicker.getCallbacks().length).toBe(0);

    monthPicker.addCallback(testDomCallback);
    expect(monthPicker.getCallbacks().length).toBe(1);
  });

  test('PUBLIC METHOD(s): destroy() | init()', () => {
    monthPicker.destroy();
    expect(rootContainer.innerHTML === '').toBe(true);
    monthPicker.init();
  });

  test('USER-EVENT (KEYDOWN): close on escape', () => {
    monthPicker.open();
    const monthPickerTempInst = monthPicker.getMonthPickerInstance() as HTMLElement;

    setTimeout(() => {
      new KeyboardEvent('keydown', { key: 'Escape' });
      setTimeout(() => {
        expect(monthPickerTempInst.dataset.pickerOpen === 'false').toBe(true);
      }, BASE_THROTTLE);
    }, BASE_THROTTLE);
  });

  test('USER-EVENT (CLICK): close monthPicker on click outside', () => {
    monthPicker.open();
    const monthPickerTempInst = monthPicker.getMonthPickerInstance() as HTMLElement;

    setTimeout(() => {
      document.body.click();
      setTimeout(() => {
        expect(monthPickerTempInst.dataset.pickerOpen === 'false').toBe(true);
      }, BASE_THROTTLE);

      monthPickerTempInst.click();
      setTimeout(() => {
        expect(monthPickerTempInst.dataset.pickerOpen === 'true').toBe(true);
      }, BASE_THROTTLE);
    });
  });

  test('USER-EVENT (CLICK): close monthPicker after selection if option present', () => {
    monthPicker.open();
    monthPicker.setCloseOnSelect(true);
    const monthPickerTempInst = monthPicker.getMonthPickerInstance() as HTMLElement;

    const tempDayInst = document.querySelectorAll(`.${BASE_DAY_CLASS}`)[MID_MONTH] as HTMLButtonElement;
    tempDayInst.click();

    setTimeout(() => {
      expect(monthPickerTempInst.dataset.pickerOpen === 'false').toBe(true);
    }, BASE_THROTTLE);
  });

  test('USER-EVENT (CLICK): next month button', () => {
    monthPicker.open();
    const currentMonth = monthPicker.getDate().getMonth();

    if (currentMonth === 11) {
      const tempyear = monthPicker.getDate().getFullYear() + 1;
      monthPicker.setDate(new Date(tempyear, 0, 1));
    }

    const nextMonthButton = document.querySelector(
      `.${PICKER_NAV_BTN_NEXT_CLASS}`
    ) as HTMLButtonElement;
    nextMonthButton.click();

    setTimeout(() => {
      expect(monthPicker.getDate().getMonth()).toBe(currentMonth + 1);
    }, BASE_THROTTLE);
  });

  test('USER-EVENT (CLICK): previous month button', () => {
    monthPicker.open();
    const currentMonth = monthPicker.getDate().getMonth();

    if (currentMonth === 0) {
      const tempyear = monthPicker.getDate().getFullYear() - 1;
      monthPicker.setDate(new Date(tempyear, 11, 1));
    }

    const prevMonthButton = document.querySelector(
      `.${PICKER_NAV_BTN_NEXT_CLASS}`
    ) as HTMLButtonElement;
    prevMonthButton.click();

    setTimeout(() => {
      expect(monthPicker.getDate().getMonth()).toBe(currentMonth - 1);
    }, BASE_THROTTLE);
  });

  /**
   * Throttle test
   * - there is probably a better way to do this lol
   * 
   * - Each throttle operation in the APP is set to 
   *   a constant INT BASE_THROTTLE. (150ms as of 8/29/23)
   * 
   * - All of these operations exist on the same level in the same scope.
   * - Rather than test all, one should suffice, I'm using the next month btn
   *   for this test to allow for easy operation count (compare start/end date).
   * 
   * @description
   * - Store the start date before operations begin
   * - Create an interval that fires twice as fast as the actual throttle.
   * - After a set amount of time, clear the interval
   * - Compare the start date to the end date, specifically how many months are
   *   between the two dates.
   * - If the throttle is working properly, the number of operations will not
   *   supersede the pre-allotted (time / BASE_THROTTLE) + padding (1-2).
   * - The padding is to account for any lag
   * 
   * @note
   * - If this does not work, try first adjusting the 'padding' variable to 2-3.
   */
  test('THROTTLE USER-EVENT (CLICK): make sure throttle abides by set throttle time', () => {
    monthPicker.open();
    const currentDate = monthPicker.getDate();
    const testLen = 1000;
    const padding = 1;

    const maxOperationsAllowed = Math.ceil(
      testLen / BASE_THROTTLE
    ) + padding;

    const nextMonthButton = document.querySelector(
      `.${PICKER_NAV_BTN_NEXT_CLASS}`
    ) as HTMLButtonElement;

    const testThrottleInterval = setInterval(() => {
      nextMonthButton.click();
    }, BASE_THROTTLE / 2);

    setTimeout(() => {
      clearInterval(testThrottleInterval);
      expect(
        getMonthDiff(
          currentDate,
          monthPicker.getDate()
        ) <= maxOperationsAllowed
      ).toBe(true);
    });
  });
});
