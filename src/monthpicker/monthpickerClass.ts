import {
  MonthPickerInterface,
  DatepickerCallback,
  InstancesInterface,
  PickerParamsInterface,
  PickerConstantsInterface,
  SingleCallback
} from '../models/interfaces';

import pickerConstants from '../constants/constants';

import {
  throttle,
  debounce,
  calcInline,
  initStyles,
  isValidAndInDom,
} from '../helpers/domHelpers';

import {
  isDateValid,
  validateInputFormat,
  formatDateForInput,
  getDateArray,
} from '../helpers/dateHelpers';

import createMonthPicker from '../components/picker';

import createInputInstance from '../components/input';

const {
  // DEFAULT_ROOT_ELEMENT,
  DEFAULT_THEME,
  DEFAULT_FORMAT,
  INPUT_FORMATS,
  INPUT_WRAPPER_ACTIVE,
  INPUT_DISABLED_CLASS,
  BASE_INPUT_CLASS,
  BASE_INPUT_WRAPPER_CLASS,
  BASE_PICKER_CLASS,
  PICKER_DISABLED_CLASS,
  PICKER_TRANSITION_CLASS,
  PICKER_FADE_OUT_CLASS,
  BASE_THROTTLE,
  BASE_DEBOUNCE,
  THEMES,
  STYLES_ID,
  FALLBACK_FONT,
} = pickerConstants as PickerConstantsInterface;

/**
 * MonthPicker
 * @param rootContainer         HTMLElement  : Must be valid HTMLElement in DOM
 * @param date                  Date Object  : Init Date
 * @param format                string       : 'mm/dd/yyyy' ... see INPUT_FORMATS
 * @param THEME                 string       : 'light' or 'dark'
 * @param callbacks             Function[]   : <Array>[callbacks]
 * @param closeOnSelect         boolean      : Close picker on date
 * @param onlyShowCurrentMonth  boolean      : Only show current month
 * @param alignPickerMiddle     boolean      : Align picker to middle of input
 */
export default class MonthPicker implements MonthPickerInterface {
  public rootContainer: HTMLElement;
  public startDate: Date;
  public pickerCallbacks: DatepickerCallback;
  public theme: string;
  public format: string;
  public closeOnSelect: boolean;
  public onlyShowCurrentMonth: boolean;
  public alignPickerMiddle: boolean;
  public throttleHandleToggle: (event: Event) => void;
  public throttleHandleScroll: (event: Event) => void;
  public throttledSetPosition: (event: Event) => void;

  /**
   * @property @private instances
   * 
   * - All DOM elements that are created upon init() will be stored and referenced here.
   * - Upon destroy(), and up until init(), all instances are set to null by default.
   */
  private instances: InstancesInterface;

  /**
   * @property @private isDestroyed
   * - if true: destroy() has been called
   * - if true: all public methods will be ignored
   * - if true: all event listeners will be removed from window
   * - if true: all instances will be set to null
   * - if true: all DOM elements will be removed
   * 
   * All of the above can be reset by calling @method init();
   */
  private isDestroyed = false;

  /**
   * @property @private isDisabled
   * 
   * - if true: disabled() has been called
   * - if true: all public methods will be ignored
   * 
   * All of the above can be reset by calling @method enable();
   */
  private isDisabled = false;

  constructor(
    rootContainer: HTMLElement,
    startDate: Date = new Date(),
    pickerCallbacks: DatepickerCallback = [],
    theme: string = DEFAULT_THEME,
    format: string = DEFAULT_FORMAT,
    closeOnSelect: boolean = false,
    onlyShowCurrentMonth: boolean = false,
    alignPickerMiddle: boolean = false,
  ) {

    /**
     * @param pickerParams
     * @private
     * @description - 
     * Used to validate constructor params on init()
     * Helps provide compatibility with vanilla JS
     */
    const pickerParams: PickerParamsInterface[] = [
      { name: 'rootContainer', value: rootContainer, type: HTMLElement },
      { name: 'startDate', value: startDate, type: Date },
      { name: 'pickerCallbacks', value: pickerCallbacks, type: Array },
      { name: 'theme', value: theme, type: 'string' },
      { name: 'format', value: format, type: 'string' },
      { name: 'closeOnSelect', value: closeOnSelect, type: 'boolean' },
      { name: 'onlyShowCurrentMonth', value: onlyShowCurrentMonth, type: 'boolean' },
      { name: 'alignPickerMiddle', value: alignPickerMiddle, type: 'boolean' },
    ];
    for (const { name, value, type } of pickerParams) {
      const invStr = `Invalid type for parameter ${name}`;
      if (typeof type === 'function') {
        if (!(value instanceof type)) {
          throw new Error(invStr);
        }
      } else {
        if (typeof value !== type) {
          throw new Error(invStr);
        }
      }
    }

    this.instances = this.#setBaseInstances();
    this.rootContainer = rootContainer;
    this.startDate = startDate;
    this.pickerCallbacks = pickerCallbacks;
    this.theme = theme;
    this.format = format;
    this.closeOnSelect = closeOnSelect;
    this.onlyShowCurrentMonth = onlyShowCurrentMonth;
    this.alignPickerMiddle = alignPickerMiddle;

    this.handleToggle = this.handleToggle.bind(this);
    this.handleSetPosition = this.handleSetPosition.bind(this);
    this.handleKeyDownToggle = this.handleKeyDownToggle.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.throttleHandleToggle = throttle(
      this.handleToggle as (event: Event) => void, BASE_THROTTLE,
    );
    this.throttleHandleScroll = throttle(this.handleScroll, BASE_THROTTLE);
    this.throttledSetPosition = debounce(this.handleSetPosition, BASE_DEBOUNCE);

    this.init();
  }

  /**
   * @private setBaseInstances
   * - resets all instances to null
   * @returns void
   */
  #setBaseInstances() {
    return {
      input: null,
      inputWrapper: null,
      monthPicker: null,
      styles: null,
    } as InstancesInterface;
  }

  /**
   * @private updateInputValue
   * - Update input theme
   * - Update input placeholder
   * - Update input dataset.dateValue
   * - Update input dataset.format
   * 
   * @param date Date Object
   * @returns void
   */
  #updateInputValue(date: Date) {
    const { inputWrapper, input } = this.instances as InstancesInterface;
    if (!input || !inputWrapper) {
      return;
    }
    const [DARK_THEME, LIGHT_THEME] = THEMES;

    inputWrapper.classList.remove(DARK_THEME);
    inputWrapper.classList.remove(LIGHT_THEME);
    inputWrapper.classList.add(this.theme);
    input.placeholder = formatDateForInput(date, this.format);
    input.dataset.dateValue = date.toString();
    input.dataset.format = this.format;
  }

  /**
   * @private updateMonthPicker
   * - Re-renders month picker
   * @param date Date Object
   * 
   * @returns void
   */
  #updateMonthPicker(date: Date) {
    const { monthPicker } = this.instances as InstancesInterface;
    if (monthPicker) { monthPicker.remove(); }

    // ../components/picker.ts
    createMonthPicker(
      this.rootContainer,
      date,
      this.theme,
      this.pickerCallbacks,
      this.closeOnSelect,
      this.onlyShowCurrentMonth,
    );
  }

  /**
   * @private isInputDisabled
   * - Check if input is disabled
   * 
   * @returns boolean
   */
  #isMonthPickerOpen() {
    const { monthPicker } = this.instances as InstancesInterface;
    return monthPicker && monthPicker.dataset.pickerOpen === 'true';
  }

  /**
   * @private isInputDisabled
   * - Check if input is disabled
   * 
   * @returns boolean
   */
  #isInputDisabled() {
    const { inputWrapper } = this.instances as InstancesInterface;
    return inputWrapper && inputWrapper.classList.contains(`${INPUT_DISABLED_CLASS}`);
  }

  /**
   * @private setInstance
   * 
   * @param instance {string} 
   * - input | styles | monthPicker | inputWrapper
   * 
   * @param selector {string}
   * - pass the associated class name from constants/constants.ts
   * 
   * @returns void
   */
  #setInstance(instance: string, selector: string) {
    if (instance === 'input') {
      const inputElement = document.querySelector(selector) as HTMLInputElement | null;
      this.instances.input = inputElement;
      return;
    }
    if (instance === 'styles') {
      const stylesElement = document.querySelector(selector) as HTMLStyleElement | null;
      this.instances.styles = stylesElement;
      return;
    }
    if (instance === 'monthPicker') {
      const monthPickerElement = document.querySelector(selector) as HTMLElement | null;
      this.instances.monthPicker = monthPickerElement;
      return;
    }
    if (instance === 'inputWrapper') {
      const divInputWrapperElement = document.querySelector(selector) as HTMLElement | null;
      this.instances.inputWrapper = divInputWrapperElement;
    }
  }

  /**
   * @private updatePickerAndInput
   * - Force close picker in case it's open
   * - Update input value then re-set it's instance reference
   * - Re-render month picker then re-set it's instance reference
   * 
   * @param date Date Object
   * @returns void
   */
  #updatePickerAndInput(date: Date) {
    this.close();
    this.#updateInputValue(date);
    this.#setInstance('inputWrapper', `.${BASE_INPUT_WRAPPER_CLASS}`);
    this.#setInstance('input', `.${BASE_INPUT_CLASS}`);
    this.#updateMonthPicker(date);
    this.#setInstance('monthPicker', `.${BASE_PICKER_CLASS}`);
  }

  #handleWarn(funcName: string, input: string, message: string) {
    console.warn(`@MonthPicker: @${funcName}
    \nInput: ${input}
    \n${message}`);
  }

  /**
   * setRootContainer(HTMLElement) 
   * - set root container
   * 
   * @param HTMLElement 
   * - Must a valid HTMLElement in the DOM
   */
  setRootContainer(rootContainer: HTMLElement) {
    if (this.isDestroyed || this.isDisabled) { return; }

    if (!rootContainer || !(rootContainer instanceof HTMLElement)) {
      this.#handleWarn('setRootContainer', String(rootContainer), 'Root container must be a DOM element.');
      return;
    }

    if (rootContainer === this.rootContainer) {
      return;
    }

    if (!isValidAndInDom(rootContainer)) {
      this.#handleWarn(
        'getRootContainer',
        String(rootContainer),
        'Passed element is either not in the DOM or is not a valid HTMLElement.'
      );
      return;
    }

    this.rootContainer = rootContainer;
    this.init();
  }

  /**
   * setDate(Date) - Sets date of monthpicker
   * 
   * @param date - Date Object (new Date())
   * Invalid dates will be ignored 
   * and will not update the monthpicker
   * @returns void
   */
  setDate(date: Date) {
    if (this.isDestroyed || this.isDisabled) { return; }

    const { monthPicker } = this.instances as InstancesInterface;
    if (!monthPicker) {
      this.#handleWarn('setDate', String(date), 'Month picker is not initialized.');
      return;
    }
    const testDate: Date = date instanceof Date ? date : new Date(date);
    if (!isDateValid(testDate)) {
      this.#handleWarn('setDate', String(date), 'Invalid date.');
      return;
    }

    this.close();
    this.#updateInputValue(testDate);
    this.#updateMonthPicker(testDate);
    // unlike the input elements, datepicker will be completely re-rendered and
    // the instance will be lost, so we need to re-set it
    this.#setInstance('monthPicker', `.${BASE_PICKER_CLASS}`);
  }

  /**
   * setFormat(string) - Schema for input display
   * 
   * @param string - Must be one of the following formats:
   * Long (January) : 'month dd, yyyy', 'month dd yyyy',
   * Abbr (Jan)     : 'mth dd yyyy', 'mth dd, yyyy'
   * No Format      : 'ddmmyyyy'
   * Numeric Slash  : 'dd/mm/yyyy', 'mm/dd/yyyy'
   * Numeric Dash   : 'dd-mm-yyyy', 'mm-dd-yyyy'
   * @returns void
   */
  setFormat(format = DEFAULT_FORMAT) {
    if (this.isDestroyed || this.isDisabled) { return; }

    if (validateInputFormat(format)) {
      this.format = format.toLowerCase();
      this.#updateInputValue(this.getDate() as Date);
    } else {
      this.#handleWarn(
        'setFormat',
        String(format),
        `INVALID FORMAT.\n\nAccepted Formats:\n${INPUT_FORMATS.join('\n')}`,
      );
    }
  }

  /**
   * setCallbacks(Function[]) - <Array>[callbacks]
   * 
   * @type DatepickerCallbacks
   * import { DatepickerCallbacks } from 'monthpicker-lite-js'
   * DatepickerCallbacks = ((selectedDate: Date) => any)[] | []
   * 
   * @param callbacks: DatepickerCallbacks
   * Array of functions: Each callback will have access to the param (date:Date) which
   * will be passed as the first and only argument upon date selection.
   * 
   * Callbacks will be instantiated in their respective array order.
   * 
   * Not required, only if you want easy access to the selected date.
   * To clear all callbacks, pass an empty array.
   * 
   * @example get date object and date array after selection
      const getSelectedDate = (date: Date) => date;
      const getDateArray = () => {
        return monthPicker.getDateArray();
      }
      monthpicker.setCallbacks([
        getSelectedDate, 
        getDateArray
      ]);
      returns: [Date, [number:year, number:month: number:day]]
   *
   * @example remove all callbacks
      monthpicker.setCallbacks([]);
   *
   * @returns void
  */
  setCallbacks(callbacks: DatepickerCallback) {
    if (this.isDestroyed || this.isDisabled) { return; }

    if (!Array.isArray(callbacks)) {
      this.#handleWarn('setCallbacks', JSON.stringify(callbacks), 'Callbacks must be passed as an array.');
      return;
    }

    this.pickerCallbacks = callbacks as DatepickerCallback;
    this.#updateMonthPicker(this.getDate() || new Date());
    this.#setInstance('monthPicker', `.${BASE_PICKER_CLASS}`);
  }

  /**
   * addCallback(Function) - Add single callback to existing callbacks
   * @param callback - Function
   * @returns void
   */
  addCallback(callback: SingleCallback) {
    if (this.isDestroyed || this.isDisabled) { return; }

    if (typeof callback !== 'function') {
      this.#handleWarn('addCallback', String(callback), 'Callback must be passed as a function.');
      return;
    }

    this.setCallbacks(
      [...this.pickerCallbacks, callback as SingleCallback]
    );
  }

  /**
   * setTheme(string) - set theme
   * @param theme - 'light' | 'dark'
   * Defaults to 'dark'
   * @returns void
   */
  setTheme(theme: string | null) {
    if (this.isDestroyed || this.isDisabled) { return; }

    if (!theme || typeof theme !== 'string') {
      this.#handleWarn('setTheme', String(theme), 'Theme must be passed as a string.');
      return;
    }
    if (theme === this.theme) { return; }

    if (!THEMES.includes(theme)) {
      this.#handleWarn('setTheme', theme, 'Please input "dark", "light", or null for "dark".');
      return;
    }

    this.theme = theme;
    this.#updatePickerAndInput(this.getDate() || new Date());
  }

  /**
   * setOnlyShowCurrentMonth(boolean)
   * - Defaults to false.
   * The monthpicker retains a fixed layout of 6 rows of 7 days.
   * By default, the monthpicker will show days from the previous and next months
   * To leave previous and next days blank, setOnlyShowCurrentMonth(true)
   * 
   * @param onlyShowCurrentMonth - boolean (default false)
   * @returns void
   */
  setOnlyShowCurrentMonth(onlyShowCurrentMonth: boolean): void {
    if (this.isDestroyed || this.isDisabled) { return; }

    if (typeof onlyShowCurrentMonth !== 'boolean') {
      this.#handleWarn('setOnlyShowCurrentMonth', String(onlyShowCurrentMonth), 'OnlyShowCurrentMonth must be passed as a boolean.');
      return;
    }

    if (this.onlyShowCurrentMonth === onlyShowCurrentMonth) { return; }
    this.onlyShowCurrentMonth = onlyShowCurrentMonth;
    this.#updateMonthPicker(this.getDate() || new Date());
    this.#setInstance('monthPicker', `.${BASE_PICKER_CLASS}`);
  }

  /**
   * setCloseOnSelect(boolean) - Close picker after date selection
   * Defaults to true.
   * @param closeOnSelect - boolean (default true)
   * @returns void
   */
  setCloseOnSelect(closeOnSelect: boolean): void {
    if (this.isDestroyed || this.isDisabled) { return; }

    if (typeof closeOnSelect !== 'boolean') {
      this.#handleWarn('setCloseOnSelect', String(closeOnSelect), 'CloseOnSelect must be passed as a boolean.');
      return;
    }

    if (this.closeOnSelect === closeOnSelect) { return; }

    this.closeOnSelect = closeOnSelect;
    this.#updateMonthPicker(this.getDate() || new Date());
    this.#setInstance('monthPicker', `.${BASE_PICKER_CLASS}`);
  }

  /**
   * setAlignPickerMiddle(boolean)
   * - Align picker to middle of input element when possible
   * - Defaults to false. (aligns to left of input)
   * @param alignPickerMiddle - boolean (default false)
   */
  setAlignPickerMiddle(alignPickerMiddle: boolean): void {
    if (this.isDestroyed || this.isDisabled) { return; }

    if (typeof alignPickerMiddle !== 'boolean') {
      this.#handleWarn('setAlignPickerMiddle', String(alignPickerMiddle), 'AlignPickerMiddle must be passed as a boolean.');
      return;
    }

    if (this.alignPickerMiddle === alignPickerMiddle) { return; }

    this.alignPickerMiddle = alignPickerMiddle;
    this.#updateMonthPicker(this.getDate() || new Date());
    this.#setInstance('monthPicker', `.${BASE_PICKER_CLASS}`);
  }

  /**
   * getRootContainer - Returns rootContainer
   * @returns HTMLElement | null
   */
  getRootContainer(): (HTMLElement | null) {
    if (this.isDestroyed || this.isDisabled) {
      return null;
    }
    return this.rootContainer;
  }

  /**
   * getDate() - Returns Date Object
   * @returns Current Date as Date Object
   */
  getDate(): Date {
    if (this.isDestroyed) { return new Date(); }

    const { input }: InstancesInterface = this.instances;
    if (!input) { return new Date(); }
    return new Date(input.dataset.dateValue as string);
  }

  /**
   * getDateArray() - Get Current Date as Array
   * @returns [year, month, day] <Array of numbers>
   */
  getDateArray(): number[] {
    if (this.isDestroyed) { return []; }

    const { input }: InstancesInterface = this.instances;
    if (!input) { return []; }
    return getDateArray(new Date(input.dataset.dateValue as string));
  }

  /**
   * getDateFormatted()
   * @returns string: date same format as input
   */
  getDateFormatted(): string {
    if (this.isDestroyed) { return ''; }

    const { input }: InstancesInterface = this.instances;
    if (!input) {
      return formatDateForInput(
        new Date(),
        this.format,
      );
    }

    const { dateValue } = input.dataset;
    return formatDateForInput(
      new Date(String(dateValue)),
      this.format,
    );
  }

  /**
   * getTheme
   * @returns string: current theme
   */
  getTheme(): string {
    if (this.isDestroyed) { return ''; }
    return this.theme;
  }

  /**
   * getFormat
   * @returns string: current format (i.e 'mm/dd/yyyy' or 'mth dd, yyyy' ect...)
   */
  getFormat(): string {
    if (this.isDestroyed) { return ''; }
    return this.format;
  }

  /**
   * getCallbacks
   * @returns Function[]: current callbacks
   */
  getCallbacks(): DatepickerCallback {
    if (this.isDestroyed) { return []; }
    return this.pickerCallbacks;
  }

  /**
   * getCloseOnSelect - Close picker after date selection (boolean)
   * @returns boolean
   */
  getCloseOnSelect(): boolean {
    if (this.isDestroyed) { return false; }
    return this.closeOnSelect;
  }

  /**
   * getOnlyShowCurrentMonth
   * @returns boolean: only show current month (boolean)
   */
  getOnlyShowCurrentMonth(): boolean {
    if (this.isDestroyed) { return false; }
    return this.onlyShowCurrentMonth;
  }

  /**
   * getAlignPickerMiddle
   * @returns boolean: align picker to middle of input element when possible (boolean)
   */
  getAlignPickerMiddle(): boolean {
    if (this.isDestroyed) { return false; }
    return this.alignPickerMiddle;
  }

  /**
   * getInstances
   * @returns {InstancesInterface} Object containing the input, picker, and styles DOM references.
    {
      input: HTMLInputElement | null,
      inputWrapper: HTMLElement | null,
      monthPicker: HTMLElement | null,
      styles: HTMLStyleElement | null,
    }
   */
  getInstances(): InstancesInterface {
    if (this.isDestroyed || this.isDisabled) return this.#setBaseInstances();
    return this.instances;
  }

  /**
   * getMonthPickerInstance
   * @returns HTMLElement | null
   */
  getMonthPickerInstance(): HTMLElement | null {
    if (this.isDestroyed || this.isDisabled) return null;
    return this.instances.monthPicker;
  }

  /**
   * getInputWrapperInstance
   * @returns HTMLElement | null
   */
  getInputWrapperInstance(): HTMLElement | null {
    if (this.isDestroyed || this.isDisabled) return null;
    return this.instances.inputWrapper;
  }

  /**
   * getInputInstance
   * @returns HTMLInputElement | null
   */
  getInputInstance(): HTMLInputElement | null {
    if (this.isDestroyed || this.isDisabled) return null;
    return this.instances.input;
  }

  /**
   * destroy
   * 
   * - Removes all monthpicker/input event listeners and clears DOM.
   * - Resets all instances (DOM element references) to null.
   * - Any method called after destroy() other than init() will be ignored.
   * @returns void
   */
  destroy() {
    this.isDestroyed = true;

    const {
      throttleHandleToggle,
      throttledSetPosition,
      handleKeyDownToggle,
      throttleHandleScroll,
    } = this as unknown as MonthPickerInterface;

    const instances: InstancesInterface = this.instances;
    if (Object.values(instances).filter(Boolean).length === 0) { return; }

    for (const instance in instances) {
      if (Object.prototype.hasOwnProperty.call(instances, instance)) {
        const value = instances[instance as keyof typeof instances];
        if (value) {
          value.remove();
          instances[instance as keyof typeof instances] = null;
        } else {
          instances[instance as keyof typeof instances] = null;
        }
      }
    }

    window.removeEventListener('click', throttleHandleToggle);
    window.removeEventListener('resize', throttledSetPosition);
    window.removeEventListener('scroll', throttleHandleScroll, true);
    window.removeEventListener('keydown', handleKeyDownToggle);
  }

  /**
   * disable - Disables monthpicker/input without clearing DOM.
   * @returns void
   */
  disable() {
    if (this.isDestroyed) { return; }
    this.isDisabled = true;
    const { inputWrapper }: InstancesInterface = this.instances;
    return inputWrapper && inputWrapper.classList.add(INPUT_DISABLED_CLASS);
  }

  /**
   * enable - Enables monthpicker/input. (Default)
   * @returns void
   */
  enable() {
    if (this.isDestroyed) { return; }
    this.isDisabled = false;
    const { inputWrapper }: InstancesInterface = this.instances;
    return inputWrapper && inputWrapper.classList.remove(INPUT_DISABLED_CLASS);
  }

  /**
   * toggle - toggle MonthPicker open/close
   * @returns void
   */
  toggle() {
    if (this.isDestroyed || this.isDisabled) { return; }
    const { monthPicker }: InstancesInterface = this.instances;
    return monthPicker && (
      monthPicker.classList.contains(PICKER_DISABLED_CLASS)
        ? this.open()
        : this.close()
    );
  }

  /**
   * close
   * @returns void
   */
  close() {
    if (this.isDestroyed) { return; }
    const { inputWrapper, monthPicker }: InstancesInterface = this.instances;
    if (!inputWrapper || !monthPicker) { return; }

    inputWrapper.dataset.pickerOpen = 'false';
    monthPicker.dataset.pickerOpen = 'false';

    inputWrapper.classList.remove(INPUT_WRAPPER_ACTIVE);
    monthPicker.classList.add(PICKER_FADE_OUT_CLASS);
    setTimeout(() => {
      monthPicker.classList.remove(PICKER_FADE_OUT_CLASS);
      monthPicker.classList.add(PICKER_DISABLED_CLASS);
    }, BASE_THROTTLE);
    inputWrapper.focus();
  }

  /**
   * open
   * @returns void
   */
  open() {
    if (this.isDestroyed || this.isDisabled) { return; }
    const { inputWrapper, monthPicker }: InstancesInterface = this.instances;
    if (!inputWrapper || !monthPicker) { return; }

    inputWrapper.dataset.pickerOpen = 'true';
    monthPicker.dataset.pickerOpen = 'true';

    calcInline(inputWrapper, monthPicker, this.alignPickerMiddle || false);
    inputWrapper.classList.add(INPUT_WRAPPER_ACTIVE);
    monthPicker.classList.remove(PICKER_DISABLED_CLASS);
    monthPicker.classList.add(PICKER_TRANSITION_CLASS);
    setTimeout(() => {
      monthPicker.classList.remove(PICKER_TRANSITION_CLASS);
    }, BASE_THROTTLE);
    monthPicker.focus();
  }

  /**
   * handleToggle - Toggle MonthPicker open/close
   * @param e MouseEvent | KeyboardEvent (click or keydown)
   * @returns void
   */
  handleToggle(e: MouseEvent | KeyboardEvent) {
    const target = e.target as HTMLElement;
    const isInput = target.closest(`.${BASE_INPUT_CLASS}`);
    const isMonthPicker = target.closest(`.${BASE_PICKER_CLASS}`);
    const isDisabled = this.#isInputDisabled();
    const isPickerOpen = this.#isMonthPickerOpen();

    if ((!isPickerOpen && !isInput) || isDisabled) {
      return;
    }

    if ((isPickerOpen && !isMonthPicker) || (!isPickerOpen && isInput)) {
      this.toggle();
    }
  }

  /**
   * handleScroll - Logic to Close MonthPicker on scroll
   * Defined here but called through throttleHandleScroll
   * @returns void
   */
  handleScroll() {
    const { inputWrapper } = this.instances as InstancesInterface;
    const isPickerOpen = inputWrapper?.classList.contains(INPUT_WRAPPER_ACTIVE);
    if (inputWrapper && isPickerOpen) {
      this.close();
    }
  }

  /**
   * handleSetPosition - Provides logic for positioning MonthPicker
   * Defined here but called through throttledSetPosition
   * @returns void
   */
  handleSetPosition() {
    const { inputWrapper, monthPicker } = this.instances as InstancesInterface;
    const isPickerOpen = inputWrapper?.classList.contains(INPUT_WRAPPER_ACTIVE);
    if (inputWrapper && monthPicker && isPickerOpen) {
      calcInline(inputWrapper, monthPicker, this.alignPickerMiddle || false);
    }
  }

  /**
   * handleKeyDownToggle - Close MonthPicker on Escape keydown
   * @param e KeyboardEvent (keydown event)
   * @returns void
   */
  handleKeyDownToggle(e: KeyboardEvent) {
    const { key } = e;
    const target = e.target as HTMLElement;
    if (key === 'Escape' && this.#isMonthPickerOpen()) {
      this.toggle();
      target.blur();
    }
  }

  /**
   * init
   * 
   * - Re-instantiates monthpicker and appends to DOM.
   * - Called automatically after declaration of monthpicker instance.
   * - Only method that can be called after @method destroy()
   * 
   * - Will ignore subsequent calls if already instantiated.
   * 
   * - init() & destroy() can work in tandem to keep the DOM clean if needed.
   * - This is useful if your app is heavy with DOM content, however,
   * it is not recommended to destroy and re-instantiate since the logic
   * is configured to update rather than destruct and re-create.
   * 
   * - Elements are only ever appended to the DOM once, if performance is a
   * concern, but you still want to have the ability to disable/enable, use
   * the disable() and enable() methods.
   * 
   * @returns void
   */
  init() {
    if (this.rootContainer === null) {
      this.#handleWarn(
        'init',
        'null',
        'Please provide a DOM element to mount the picker to.',
      );
      return;
    }

    this.destroy(); // full reset before init
    this.isDestroyed = false;

    const {
      rootContainer,
      startDate,
      format,
      theme,
      throttleHandleToggle,
      throttledSetPosition,
      handleKeyDownToggle,
      throttleHandleScroll,
    } = this as MonthPickerInterface;

    const instances = this.instances as InstancesInterface;
    // Create Input && set instances
    createInputInstance(
      rootContainer,
      startDate,
      format || DEFAULT_FORMAT,
      theme || DEFAULT_THEME,
    );

    // Create InputWrapper && Input Element && set instances
    this.#setInstance('inputWrapper', `.${BASE_INPUT_WRAPPER_CLASS}`);
    this.#setInstance('input', `.${BASE_INPUT_CLASS}`);

    // Create MonthPicker && set instance
    this.#updateMonthPicker(startDate);
    this.#setInstance('monthPicker', `.${BASE_PICKER_CLASS}`);

    // Get the users font-family and append it to styles string before injecting into HEAD
    // If the font-family is not set (Times New Roman) append fallback font declaration
    // 'system-ui, -apple-system, Roboto, sans-serif' || FALLBACK_FONT
    const { inputWrapper, monthPicker } = instances as InstancesInterface;
    const { fontFamily } = getComputedStyle(monthPicker as HTMLElement);
    initStyles(
      fontFamily.slice(1, -1) === 'Times New Roman' ? FALLBACK_FONT : 'inherit',
    );
    this.#setInstance('styles', `#${STYLES_ID}`);

    // Set Initial Positioning of date picker
    if (inputWrapper && monthPicker) {
      calcInline(inputWrapper, monthPicker, this.alignPickerMiddle || false);
    }

    // ALL EVENT LISTENERS ARE SET HERE
    // They are removed on destroy which is called on init and can be called declaratively
    // All event listeners aside from purely destructive actions (keydown: escape) 

    // Events are not attached to the Root Container specified by user 
    // since the datepicker will act as a fixed position element and needs
    // calculations based on the viewport when it is open
    window.addEventListener('click', throttleHandleToggle);
    window.addEventListener('resize', throttledSetPosition);
    window.addEventListener('scroll', throttleHandleScroll, true);
    window.addEventListener('keydown', handleKeyDownToggle);
  }
}
