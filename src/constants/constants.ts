import { PickerConstantsInterface } from '../models/interfaces';

const pickerConstants: PickerConstantsInterface = {
  /* ***************************************** */
  DAYS_LENGTH: 42,
  MID_MONTH: 14,
  BASE_THROTTLE: 150,
  BASE_DEBOUNCE: 50,
  PICKER_HEIGHT: 278,
  PICKER_WIDTH: 272,
  POSITION_PADDING: 6,
  /* ***************************************** */

  /* ***************************************** */
  BASE_PICKER_CLASS: 'month-picker',
  PICKER_DISABLED_CLASS: 'picker-disabled',
  PICKER_TRANSITION_CLASS: 'picker-transition',
  PICKER_SLIDE_PREFIX: 'slide-',
  PICKER_FADE_OUT_CLASS: 'picker-fade-out',
  /* ***************************************** */

  PICKER_HEADER_CLASS: 'month-picker-header',
  PICKER_TITLE_CLASS: 'month-year',

  PICKER_NAV_BTN_WRAPPER_CLASS: 'nav-btns',
  PICKER_NAV_BTN_PREV_CLASS: 'prev',
  PICKER_NAV_BTN_NEXT_CLASS: 'next',

  PICKER_WEEKDAYS_CLASS: 'weekdays',
  PICKER_WEEKDAY_CLASS: 'weekday',
  PICKER_DAYS_WRAPPER_CLASS: 'month-div',
  DISABLED_DAY_CLASS: 'disabled-day',

  BASE_DAY_CLASS: 'day',
  SELECTED_CLASS: 'selected-day',

  PREV_MONTH_CLASS: 'prev-month',
  NEXT_MONTH_CLASS: 'next-month',

  BASE_INPUT_WRAPPER_CLASS: 'month-picker-input-wrapper',
  INPUT_WRAPPER_ACTIVE: 'picker-input-active',
  INPUT_DISABLED_CLASS: 'picker-input-disabled',
  BASE_INPUT_CLASS: 'month-picker-input',

  STYLES_ID: 'month-picker-style',
  FALLBACK_FONT: 'system-ui, -apple-system, Roboto, sans-serif',

  /* ***************************************** */
  DAY_NAMES: ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'],
  MONTHS: [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December',
  ],
  INPUT_FORMATS: [
    'ddmmyyyy', 'dd/mm/yyyy', 'mm/dd/yyyy', 'dd-mm-yyyy', 'mm-dd-yyyy',
    'month dd, yyyy', 'month dd yyyy',
    'mth dd yyyy', 'mth dd, yyyy',
  ],
  DEFAULT_FORMAT: 'month dd, yyyy',

  DEFAULT_THEME: 'dark',
  THEMES: ['dark', 'light'],
  /* ***************************************** */
};

export default pickerConstants;
