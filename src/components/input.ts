import pickerConstants from '../constants/constants';

import { formatDateForInput } from '../helpers/dateHelpers';

import { createCalendarSVG } from '../helpers/domHelpers';

import { PickerConstantsInterface } from '../models/interfaces';

const {
  BASE_INPUT_WRAPPER_CLASS,
  BASE_INPUT_CLASS,
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
  const inputWrapper = document.createElement('div') as HTMLDivElement;
  inputWrapper.classList.add(BASE_INPUT_WRAPPER_CLASS);
  // inputWrapper inherits theme, as does the month picker
  inputWrapper.classList.add(THEME);

  const input = document.createElement('input') as HTMLInputElement;
  input.classList.add(BASE_INPUT_CLASS);
  input.type = 'text';

  input.dataset.dateValue = date ? String(date) : String(new Date());
  input.dataset.format = format;

  input.readOnly = true;
  input.placeholder = formatDateForInput(date, format);
  input.setAttribute('aria-label', 'Month Picker Input');
  input.setAttribute('aria-haspopup', 'true');
  input.setAttribute('aria-controls', 'month-picker');
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('contenteditable', 'false');
  input.setAttribute('aria-autocomplete', 'none');
  input.setAttribute('aria-readonly', 'true');

  const iconwrapper = document.createElement('span') as HTMLSpanElement;
  iconwrapper.append(createCalendarSVG());
  inputWrapper.append(iconwrapper, input);
  ROOT.append(inputWrapper);
};

export default createInputInstance;
