// Ver: 1.1.1 (8-28-2023)

/**
 * @type SingleCallback
 * A callback function that takes a single
 * Date argument and can return any value.
 *
 * @callback
 * @param {Date} selectedDate - The selected date.
 * @returns {any} - Can return any value.
 */
export type SingleCallback = ((selectedDate: Date) => any);

/**
 * @type DatepickerCallback
 * An array of callback functions where each function
 * takes a single Date argument and can return any value.
 * May be an empty array.
 *
 * @def {Array<function(Date): any>} DatepickerCallback
 */
export type DatepickerCallback = ((selectedDate: Date) => any)[] | [];

/**
 * @type ThrottledFn
 * Represents a function with throttling applied.
 * It retains the same parameters and return type as the original function.
 *
 * @template T - A function type.
 * @param {...Parameters<T>} args - The arguments the function accepts.
 * @returns {ReturnType<T>} - The return type of the function.
 */
export type ThrottledFn<T extends (
  ...args: any
) => any> = (...args: Parameters<T>) => ReturnType<T>;

/**
 * @interface PickerOptionsInterface
 * Interface for a valid HTML element with an added
 * property to check if it's connected to the DOM.
 *
 *
 * @extends HTMLElement
 * @property {boolean} isConnected -
 * Indicates if the element is connected to the DOM.
 */
export interface ValidHTMLElement extends HTMLElement {
  isConnected: boolean;
}

/**
 * @interface DatepickerInterface
 * Interface for utility functions related to dates.
 *
 * @property {function(any): boolean} isDateValid -
 * Checks if the given date is valid.
 *
 * @property {function(number, number): number} daysInMonth -
 * Determines the number of days in a given month of a specific year.
 *
 * @property {function(Date[], number): string} formatMonthYear -
 * Formats an array of days into a month-year string.
 *
 * @property {function(Date, string): string} formatDateForInput -
 * Formats a selected date into a string according to the given format.
 *
 * @property {function(Date): number[]} getDateArray -
 * Converts a date into an array of numbers.
 *
 * @property {function(string): Date} parseDateString -
 * Parses a date string and returns a Date object.
 *
 * @property {function(string): Date} parseDateString -
 * Parses a date string and returns a Date object.
 */
export interface DateHelpersInterface {
  isDateValid(date: any): boolean;
  daysInMonth(year: number, month: number): number;
  formatMonthYear(days: Date[], currYear: number): string;
  formatDateForInput(selectedDate: Date, format: string): string;
  getDateArray(day: Date): number[];
  parseDateString(dateString: string): Date;
}

/**
 * @interface InputDataInterface
 * Interface for input data.
 *
 * @property {string} dateValue -
 * The value of the date input.
 *
 * @property {string} format -
 * The desired date format.
 *
 * @property {string} placeholder -
 * The placeholder text for the input.
 */
export interface InputDataInterface {
  dateValue: string;
  format: string;
  placeholder: string;
}

/**
 * @interface InstancesInterface
 * Interface representing the different instances related to a date picker.
 *
 * @property {HTMLInputElement | null} input -
 * The input element for date selection.
 *
 * @property {HTMLElement | null} inputWrapper -
 * The wrapper element for the input.
 *
 * @property {HTMLElement | null} monthPicker -
 * The month picker element.
 *
 * @property {HTMLStyleElement | null} styles -
 * The style element for the picker.
 *
 */
export interface InstancesInterface {
  input: HTMLInputElement | null;
  inputWrapper: HTMLElement | null;
  monthPicker: HTMLElement | null;
  styles: HTMLStyleElement | null;
}

/**
 * @interface CalcInlineReturnInterface
 * - Top and Left return values for calcInline function.
 */
export interface CalcInlineReturnInterface {
  top: string;
  left: string;
}

/**
 * @interface PickerParamsInterface
 * Interface for picker parameters.
 *
 * @property {string} name - The name of the picker parameter.
 *
 * @property {any} value - The value of the picker parameter.
 *
 * @property {any} type - The type of the picker parameter.
 */
export interface PickerParamsInterface {
  name: string;
  value: any;
  type: any;
}

/**
 * @interface MonthPickerOptionsInterface
 * Interface for month picker options.
 *
 * @property {HTMLElement} rootContainer -
 * The root container for the month picker.
 *
 * @property {Date | undefined} startDate -
 * The starting date for the picker.
 *
 * @property {DatepickerCallback | undefined} pickerCallbacks -
 * The callbacks for the date picker.
 *
 * @property {string | undefined} theme -
 * The theme for the month picker.
 *
 * @property {string | undefined} format -
 * The format for the date in the picker.
 *
 * @property {boolean | undefined} closeOnSelect -
 * Determines if the picker should close upon selection.
 *
 * @property {boolean | undefined} onlyShowCurrentMonth -
 * If true, only the current month will be displayed.
 *
 * @property {boolean | undefined} alignPickerMiddle -
 * If true, aligns the picker to the middle of the screen or element.
 */
export interface MonthPickerOptionsInterface {
  rootContainer: HTMLElement;
  startDate: Date | undefined;
  pickerCallbacks: DatepickerCallback | undefined;
  theme: string | undefined;
  format: string | undefined;
  closeOnSelect: boolean | undefined;
  onlyShowCurrentMonth: boolean | undefined;
  alignPickerMiddle: boolean | undefined;
}

/**
 * @interface MonthPickerInterface
 * Interface for the month picker class.
 */
export interface MonthPickerInterface {
  rootContainer: HTMLElement;
  startDate: Date;
  pickerCallbacks: DatepickerCallback;
  theme: string;
  format: string;
  closeOnSelect: boolean;
  onlyShowCurrentMonth: boolean;
  alignPickerMiddle: boolean;

  setRootContainer(rootContainer: HTMLElement): void;
  setDate(date: Date): void;
  setFormat(format: string): void;
  setCallbacks(callbacks: DatepickerCallback): void;
  setTheme(theme: string): void;
  setCloseOnSelect(closeOnSelect: boolean): void;
  setOnlyShowCurrentMonth(onlyShowCurrentMonth: boolean): void;
  setAlignPickerMiddle(alignPickerMiddle: boolean): void;
  addCallback(callback: SingleCallback): void;

  getRootContainer(): HTMLElement | null;
  getDate(): Date;
  getDateArray(): number[];
  getDateFormatted(): string;
  getTheme(): string;
  getCallbacks(): DatepickerCallback;
  getFormat(): string;
  getCloseOnSelect(): boolean;
  getOnlyShowCurrentMonth(): boolean;
  getAlignPickerMiddle(): boolean;
  getInstances(): InstancesInterface;
  getMonthPickerInstance(): HTMLElement | null;
  getInputWrapperInstance(): HTMLElement | null;
  getInputInstance(): HTMLInputElement | null;

  destroy(): void;
  disable(): void;
  enable(): void;
  toggle(): void;
  close(): void;
  open(): void;

  handleToggle(e: MouseEvent | KeyboardEvent): void;
  handleScroll(): void;
  handleSetPosition(): void;
  handleKeyDownToggle(e: KeyboardEvent): void;

  throttleHandleToggle(event: Event): void;
  throttleHandleScroll(event: Event): void;
  throttledSetPosition(event: Event): void;

  init(): void;
}

/**
 * @interface PickerConstantsInterface
 * Interface for picker constants,
 * Namely CSS classes & default values.
 */
export interface PickerConstantsInterface {
  DAYS_LENGTH: number,
  MID_MONTH: number,
  BASE_THROTTLE: number,
  BASE_DEBOUNCE: number,
  PICKER_HEIGHT: number,
  PICKER_WIDTH: number,
  POSITION_PADDING: number,

  BASE_PICKER_CLASS: string,
  PICKER_DISABLED_CLASS: string,
  PICKER_TRANSITION_CLASS: string,
  PICKER_SLIDE_PREFIX: string,
  PICKER_FADE_OUT_CLASS: string,

  PICKER_HEADER_CLASS: string,
  PICKER_TITLE_CLASS: string;

  PICKER_NAV_BTN_WRAPPER_CLASS: string;
  PICKER_NAV_BTN_PREV_CLASS: string;
  PICKER_NAV_BTN_NEXT_CLASS: string;

  PICKER_WEEKDAYS_CLASS: string;
  PICKER_WEEKDAY_CLASS: string;
  PICKER_DAYS_WRAPPER_CLASS: string;
  DISABLED_DAY_CLASS: string;

  BASE_DAY_CLASS: string,
  SELECTED_CLASS: string,

  PREV_MONTH_CLASS: string,
  NEXT_MONTH_CLASS: string,

  BASE_INPUT_WRAPPER_CLASS: string,
  INPUT_WRAPPER_ACTIVE: string,
  INPUT_DISABLED_CLASS: string,
  BASE_INPUT_CLASS: string,

  STYLES_ID: string,
  FALLBACK_FONT: string,

  DAY_NAMES: string[],
  MONTHS: string[],

  INPUT_FORMATS: string[],
  DEFAULT_FORMAT: string,

  DEFAULT_THEME: string,
  THEMES: string[],

  // DEFAULT_ROOT_ELEMENT: HTMLElement,
}
