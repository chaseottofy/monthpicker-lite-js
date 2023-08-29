export type DatepickerCallback = ((selectedDate: Date) => any)[] | [];

export type ThrottledFunction<T extends (
  ...args: any
) => any> = (...args: Parameters<T>) => ReturnType<T>;

export interface ValidHTMLElement extends HTMLElement {
  isConnected: boolean;
}

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

  DEFAULT_ROOT_ELEMENT: HTMLElement,
}

export interface DateHelpersInterface {
  isDateValid(date: any): boolean;
  daysInMonth(year: number, month: number): number;
  formatMonthYear(days: Date[], currYear: number): string;
  formatDateForInput(selectedDate: Date, format: string): string;
  getDateArray(day: Date): number[];
  parseDateString(dateString: string): Date;
}

export interface InputDataInterface {
  dateValue: string;
  format: string;
  placeholder: string;
}

export interface InstancesInterface {
  input: HTMLInputElement | null;
  inputWrapper: HTMLElement | null;
  monthPicker: HTMLElement | null;
  styles: HTMLStyleElement | null;
}

export interface PickerParamsInterface {
  name: string;
  value: any;
  type: any;
}

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
