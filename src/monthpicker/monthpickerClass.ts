import {
  MonthPickerInterface,
  DatepickerCallback,
  InstancesInterface,
  PickerParamsInterface,
  PickerConstantsInterface,
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
  DEFAULT_ROOT_ELEMENT,
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
 * @param ROOT                  HTMLElement  : Must be in DOM
 * @param date                  Date         : Init Date
 * @param format                input-format : mm/dd/yyyy ect.
 * @param THEME                 string       : light or dark
 * @param callbacks             Function[]   : <Array>[callbacks]
 * @param closeOnSelect         boolean      : Close picker on date 
 * @param onlyShowCurrentMonth  boolean      : Only show current month
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

  // instances: populates with picker/input DOM elements upon init for reference
  // upon destruction & before re-init, all instances are removed & set to null
  private instances: InstancesInterface;
  // isDestroyed: use to freeze public methods after destroy() is called
  private isDestroyed = false;
  private isDisabled = false;

  constructor(
    rootContainer: HTMLElement = DEFAULT_ROOT_ELEMENT,
    startDate: Date = new Date(),
    pickerCallbacks: DatepickerCallback = [],
    theme: string = DEFAULT_THEME,
    format: string = DEFAULT_FORMAT,
    closeOnSelect: boolean = false,
    onlyShowCurrentMonth: boolean = false,
    alignPickerMiddle: boolean = false,
  ) {

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

  #setBaseInstances() {
    return {
      input: null,
      inputWrapper: null,
      monthPicker: null,
      styles: null,
    } as InstancesInterface;
  }

  #updateInputValue(date: Date) {
    const { inputWrapper, input } = this.instances as InstancesInterface;
    if (!input || !inputWrapper) {
      return;
    }
    const [DARK_THEME, LIGHT_THEME] = THEMES as string[];

    inputWrapper.classList.remove(DARK_THEME);
    inputWrapper.classList.remove(LIGHT_THEME);
    inputWrapper.classList.add(this.theme as string);
    input.placeholder = formatDateForInput(date, this.format as string);
    input.dataset.dateValue = date.toString();
    input.dataset.format = this.format as string;
  }

  #updateMonthPicker(date: Date) {
    const { monthPicker } = this.instances as InstancesInterface;
    if (monthPicker) { monthPicker.remove(); }
    createMonthPicker(
      this.rootContainer,
      date,
      this.theme as string,
      this.pickerCallbacks || [],
      this.closeOnSelect || false,
      this.onlyShowCurrentMonth || false,
    );
  }

  #isMonthPickerOpen() {
    const { monthPicker } = this.instances as InstancesInterface;
    return monthPicker && !monthPicker.classList.contains(`${PICKER_DISABLED_CLASS}`);
  }

  #isInputDisabled() {
    const { inputWrapper } = this.instances as InstancesInterface;
    return inputWrapper && inputWrapper.classList.contains(`${INPUT_DISABLED_CLASS}`);
  }

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

  setRootContainer(rootContainer: HTMLElement) {
    if (this.isDestroyed || this.isDisabled) { return; }

    if (!rootContainer || !(rootContainer instanceof HTMLElement)) {
      this.#handleWarn('setRootContainer', String(rootContainer), 'Root container must be a DOM element.');
      return;
    }

    if (rootContainer === this.rootContainer) {
      console.log('rootContainer is already set to this element.');
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

  getRootContainer(): (HTMLElement | null) {
    if (this.isDestroyed || this.isDisabled) {
      return null;
    }

    return this.rootContainer;
  }

  getDate(): Date {
    if (this.isDestroyed) { return new Date(); }

    const { input }: InstancesInterface = this.instances;
    if (!input) { return new Date(); }
    return new Date(input.dataset.dateValue as string);
  }

  getDateArray(): number[] {
    if (this.isDestroyed) { return []; }

    const { input }: InstancesInterface = this.instances;
    if (!input) { return []; }
    return getDateArray(new Date(input.dataset.dateValue as string));
  }

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

  getTheme(): string {
    if (this.isDestroyed) { return ''; }
    return this.theme;
  }

  getFormat(): string {
    if (this.isDestroyed) { return ''; }
    return this.format;
  }

  getCallbacks(): DatepickerCallback {
    if (this.isDestroyed) { return []; }
    return this.pickerCallbacks;
  }

  getCloseOnSelect(): boolean {
    if (this.isDestroyed) { return false; }
    return this.closeOnSelect;
  }

  getOnlyShowCurrentMonth(): boolean {
    if (this.isDestroyed) { return false; }
    return this.onlyShowCurrentMonth;
  }

  getAlignPickerMiddle(): boolean {
    if (this.isDestroyed) { return false; }
    return this.alignPickerMiddle;
  }

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

  disable() {
    if (this.isDestroyed) { return; }
    this.isDisabled = true;
    const { inputWrapper }: InstancesInterface = this.instances;
    return inputWrapper && inputWrapper.classList.add(INPUT_DISABLED_CLASS);
  }

  enable() {
    if (this.isDestroyed) { return; }
    this.isDisabled = false;
    const { inputWrapper }: InstancesInterface = this.instances;
    return inputWrapper && inputWrapper.classList.remove(INPUT_DISABLED_CLASS);
  }

  toggle() {
    if (this.isDestroyed || this.isDisabled) { return; }
    const { monthPicker }: InstancesInterface = this.instances;
    return monthPicker && (
      monthPicker.classList.contains(PICKER_DISABLED_CLASS)
        ? this.open()
        : this.close()
    );
  }

  close() {
    if (this.isDestroyed) { return; }
    const { inputWrapper, monthPicker }: InstancesInterface = this.instances;
    if (!inputWrapper || !monthPicker) { return; }

    inputWrapper.classList.remove(INPUT_WRAPPER_ACTIVE);
    monthPicker.classList.add(PICKER_FADE_OUT_CLASS);
    setTimeout(() => {
      monthPicker.classList.remove(PICKER_FADE_OUT_CLASS);
      monthPicker.classList.add(PICKER_DISABLED_CLASS);
    }, BASE_THROTTLE);
    inputWrapper.focus();
  }

  open() {
    if (this.isDestroyed || this.isDisabled) { return; }
    const { inputWrapper, monthPicker }: InstancesInterface = this.instances;
    if (!inputWrapper || !monthPicker) { return; }

    calcInline(inputWrapper, monthPicker, this.alignPickerMiddle || false);
    inputWrapper.classList.add(INPUT_WRAPPER_ACTIVE);
    monthPicker.classList.remove(PICKER_DISABLED_CLASS);
    monthPicker.classList.add(PICKER_TRANSITION_CLASS);
    setTimeout(() => {
      monthPicker.classList.remove(PICKER_TRANSITION_CLASS);
    }, BASE_THROTTLE);
    monthPicker.focus();
  }

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

  handleScroll() {
    const { inputWrapper } = this.instances as InstancesInterface;
    const isPickerOpen = inputWrapper?.classList.contains(INPUT_WRAPPER_ACTIVE);
    if (inputWrapper && isPickerOpen) {
      this.close();
    }
  }

  handleSetPosition() {
    const { inputWrapper, monthPicker } = this.instances as InstancesInterface;
    const isPickerOpen = inputWrapper?.classList.contains(INPUT_WRAPPER_ACTIVE);
    if (inputWrapper && monthPicker && isPickerOpen) {
      calcInline(inputWrapper, monthPicker, this.alignPickerMiddle || false);
    }
  }

  handleKeyDownToggle(e: KeyboardEvent) {
    const { key } = e;
    const target = e.target as HTMLElement;
    if (key === 'Escape' && this.#isMonthPickerOpen()) {
      this.toggle();
      target.blur();
    }
  }

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
