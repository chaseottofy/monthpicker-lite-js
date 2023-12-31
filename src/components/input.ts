import pickerConstants from '../constants/constants';

import { formatDateForInput } from '../helpers/date-helpers';

import { createCalendarSVG } from '../helpers/dom-helpers';

import { PickerConstantsInterface } from '../models/interfaces';

const {
  BASE_INPUT_WRAPPER_CLASS,
  BASE_INPUT_CLASS,
  PICKER_THEME_DARK,
  PICKER_THEME_LIGHT,
} = pickerConstants as PickerConstantsInterface;

/**
 * createInputInstance
 * @param ROOT                  HTMLElement  : Must be in DOM
 * @param date                  Date         : Init Date
 * @param format                input-format : mm/dd/yyyy ect.
 * @param THEME                 string       : light or dark
 */
const createInputInstance = (
  ROOT: HTMLElement,
  date: Date,
  format: string,
  THEME: string,
): void => {
  const inputWrapper = document.createElement('div') as HTMLElement;
  inputWrapper.classList.add(BASE_INPUT_WRAPPER_CLASS);
  // inputWrapper inherits theme, as does the month picker
  inputWrapper.classList.add(THEME === 'light' ? PICKER_THEME_LIGHT : PICKER_THEME_DARK);
  inputWrapper.dataset.pickerOpen = 'false';

  const input = document.createElement('input') as HTMLInputElement;
  input.classList.add(BASE_INPUT_CLASS);
  input.type = 'text';

  input.dataset.dateValue = date ? String(date) : String(new Date());
  input.dataset.format = format;

  input.name = BASE_INPUT_CLASS;
  input.readOnly = true;
  input.placeholder = formatDateForInput(date, format);
  input.ariaLabel = 'Month Picker Input';
  input.ariaHasPopup = 'true';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.contentEditable = 'false';

  const iconwrapper = document.createElement('span') as HTMLSpanElement;
  iconwrapper.append(createCalendarSVG());
  inputWrapper.append(iconwrapper, input);
  ROOT.append(inputWrapper);
};

export default createInputInstance;
