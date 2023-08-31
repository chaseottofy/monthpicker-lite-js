import { PickerConstantsInterface } from '../models/interfaces';
import styles from '../monthpicker.module.css';

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
  PICKER_THEME_DARK: styles.dark,
  PICKER_THEME_LIGHT: styles.light,

  /* ***************************************** */
  BASE_PICKER_CLASS: styles.monthPicker,
  PICKER_DISABLED_CLASS: styles.pickerDisabled,
  PICKER_TRANSITION_CLASS: styles.pickerTransition,
  PICKER_SLIDE_RIGHT_CLASS: styles.slideRight,
  PICKER_SLIDE_LEFT_CLASS: styles.slideLeft,
  PICKER_FADE_OUT_CLASS: styles.pickerFadeOut,
  /* ***************************************** */

  PICKER_HEADER_CLASS: styles.monthPickerHeader,
  PICKER_TITLE_CLASS: styles.monthYear,

  PICKER_NAV_BTN_WRAPPER_CLASS: styles.navBtns,
  PICKER_NAV_BTN_PREV_CLASS: styles.prev,
  PICKER_NAV_BTN_NEXT_CLASS: styles.next,

  PICKER_WEEKDAYS_CLASS: styles.weekdays,
  PICKER_WEEKDAY_CLASS: styles.weekday,
  PICKER_DAYS_WRAPPER_CLASS: styles.monthDiv,
  DISABLED_DAY_CLASS: styles.disabledDay,

  BASE_DAY_CLASS: styles.day,
  SELECTED_CLASS: styles.selectedDay,

  PREV_MONTH_CLASS: styles.prevMonth,
  NEXT_MONTH_CLASS: styles.nextMonth,

  BASE_INPUT_WRAPPER_CLASS: styles.monthPickerInputWrapper,
  INPUT_WRAPPER_ACTIVE: styles.pickerInputActive,
  INPUT_DISABLED_CLASS: styles.pickerInputDisabled,
  BASE_INPUT_CLASS: styles.monthPickerInput,

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
