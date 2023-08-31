import pickerConstants from '../constants/constants';

import {
  ThrottledFn,
  PickerConstantsInterface,
  ValidHTMLElement,
  CalcInlineReturnInterface,
} from '../models/interfaces';

const {
  STYLES_ID,
  BASE_INPUT_WRAPPER_CLASS,
  BASE_PICKER_CLASS,
  PICKER_HEIGHT,
  PICKER_WIDTH,
  POSITION_PADDING,
} = pickerConstants as PickerConstantsInterface;

const W3NSURL = 'http://www.w3.org/2000/svg';
const STYLES = '';

export function isValidAndInDom(element: any): element is ValidHTMLElement {
  return element instanceof HTMLElement && element.isConnected;
}

// estlint-disable-next-line max-len
export function throttle<T extends (...args: any) => any>(func: T, limit: number): ThrottledFn<T> {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  return function Throttled(this: any): ReturnType<T> {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;

    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
      lastResult = func.apply(this, args);
    }
    return lastResult;
  };
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T, ms: number): (...args: any[]) => any {
  let timeoutId: number | undefined;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms) as any;
  };
}

export function createCaret(direction: string): SVGElement {
  const path1 = document.createElementNS(W3NSURL, 'path');
  path1.setAttribute('d', 'M0 0h24v24H0z');
  path1.setAttribute('fill', 'none');

  const path2 = document.createElementNS(W3NSURL, 'path');
  path2.setAttribute(
    'd',
    direction === 'prev'
      ? 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'
      : 'M8.59 16.59L10 18l6-6-6-6L8.59 7.41 13.17 12z',
  );

  const caret = document.createElementNS(W3NSURL, 'svg');
  caret.setAttribute('xmlns', W3NSURL);
  caret.setAttribute('viewBox', '0 0 24 24');
  caret.append(path1, path2);
  return caret as SVGElement;
}

export function createCalendarSVG(): SVGElement {
  const rect1 = document.createElementNS(W3NSURL, 'rect');
  rect1.setAttribute('x', '3');
  rect1.setAttribute('y', '4');
  rect1.setAttribute('width', '18');
  rect1.setAttribute('height', '18');
  rect1.setAttribute('rx', '2');
  rect1.setAttribute('ry', '2');
  const path1 = document.createElementNS(W3NSURL, 'path');
  path1.setAttribute('d', 'M16 2v4');
  const path2 = document.createElementNS(W3NSURL, 'path');
  path2.setAttribute('d', 'M8 2v4');
  const path3 = document.createElementNS(W3NSURL, 'path');
  path3.setAttribute('d', 'M3 10h18');
  const svg1 = document.createElementNS(W3NSURL, 'svg');
  svg1.setAttribute('height', '16px');
  svg1.setAttribute('width', '16px');
  svg1.setAttribute('shape-rendering', 'geometricPrecision');
  svg1.setAttribute('fill', 'none');
  svg1.setAttribute('stroke', 'currentColor');
  svg1.setAttribute('stroke-linecap', 'round');
  svg1.setAttribute('stroke-linejoin', 'round');
  svg1.setAttribute('stroke-width', '1');
  svg1.setAttribute('viewBox', '0 0 24 24');
  svg1.append(rect1, path1, path2, path3);
  return svg1 as SVGElement;
}

export function createNavButton(title: string, btnClass: string): HTMLButtonElement {
  const navButton = document.createElement('button');
  navButton.ariaLabel = title;
  navButton.classList.add(btnClass);
  navButton.dataset.navtitle = title;
  navButton.append(createCaret(title.slice(0, 4).toLowerCase()));
  return navButton;
}

export function initStyles(fontFamily: string): void {
  const getstyles = document.head?.querySelector(`#${STYLES_ID}`);
  const FF = `{\n font-family: ${fontFamily} !important;\n}`;
  const fontDeclaration = `\n.${BASE_INPUT_WRAPPER_CLASS},\n.${BASE_PICKER_CLASS}${FF}`;
  const SETST = STYLES + fontDeclaration;
  if (getstyles) {
    getstyles.textContent = SETST;
  } else {
    const monthPickerStyle = document.createElement('style');
    monthPickerStyle.textContent = SETST;
    monthPickerStyle.id = STYLES_ID;
    document.head.append(monthPickerStyle);
  }
}

/**
 * Calculate the optimal datepicker position relative to input element.
 * This function ensures that the picker does not overflow the window, and
 * optionally centers it relative to the input.
 *
 * @scopes
 * MonthPicker.open()              - call on open
 * MonthPicker.init()              - call on init
 * MonthPicker.handleSetPosition() - resize event
 *
 * @param {HTMLElement} input   input element to align picker width.
 * @param {HTMLElement} picker  picker element to position.
 * @param {boolean} alignMiddle If true, center the picker relative to the input.
 * @returns {void}
 * @description
 * - Calculate space above and below input element
 *
 * - Set initial top/left position to reflect below Y position
 *   and left X position relative to input element
 *
 * - Check for overflow on bottom, if true, repeat above steps
 *   in reverse (set picker above input)
 *
 * - Check for overflow on left, if true, get difference and subtract
 *   from left position
 *
 * - If user has set alignMiddle to true, calculate X position necessary
 *   to center picker relative to input element
 *
 * - Check once more for any X or Y overflow, if true, set picker to corner
 *   of closest edge
 *
 * - Check if screen width is nearly similar or smaller than picker, if true
 *   set picker x:MIDDLE, y:MIDDLE
 */
export function calcInline(
  input: HTMLElement,
  alignMiddle: boolean,
): CalcInlineReturnInterface {
  const {
    bottom: inputBottom,
    left: inputLeft,
    top: boundsTop,
  } = input.getBoundingClientRect();

  const {
    offsetTop: inputTop,
    offsetHeight: inputHeight,
    offsetWidth: inputWidth,
  } = input;

  const {
    innerHeight,
    innerWidth,
    scrollX,
    scrollY,
  } = window;

  // space below & above input element
  const [spaceBelow, spaceAbove] = [innerHeight - inputBottom, boundsTop];

  /**
   * TOP
   * - set initial to either top of input or bottom of input depending on space
   */
  let settop = spaceBelow > spaceAbove
    ? inputTop + inputHeight + POSITION_PADDING
    : inputTop - PICKER_HEIGHT - POSITION_PADDING;

  // if datepicker is overflowing top of window
  if (scrollY >= settop) {
    settop -= settop - scrollY - POSITION_PADDING;
  }

  // if datepicker is overflowing bottom of window
  if (settop + PICKER_HEIGHT > innerHeight + scrollY) {
    const diffBottom = settop + PICKER_HEIGHT - innerHeight - scrollY;
    settop -= diffBottom + inputHeight;
  }

  // if datepicker is taller or equal to window height
  if ((PICKER_HEIGHT - (POSITION_PADDING * 2)) >= innerHeight) {
    settop = scrollY + POSITION_PADDING;
  }

  /**
   * LEFT
   * - set initial to left of input
   */
  let setleft = inputLeft + scrollX - POSITION_PADDING;

  // if datepicker is overflowing left of window
  if (setleft + PICKER_WIDTH > innerWidth) {
    setleft = innerWidth - (PICKER_WIDTH + POSITION_PADDING);
  }

  // center picker
  if (alignMiddle && PICKER_WIDTH !== inputWidth) {
    const pickerHalf = Number((PICKER_WIDTH / 2).toFixed(2));
    const inputHalf = Number((inputWidth / 2).toFixed(2));
    const halfDiff = pickerHalf > inputHalf
      ? pickerHalf - inputHalf
      : inputHalf - pickerHalf;
    setleft = inputLeft - halfDiff + scrollX;
  }

  // datepicker overflowing left
  if (setleft < 0) {
    setleft = POSITION_PADDING;
  }

  // datepicker overflowing right
  if (setleft + PICKER_WIDTH >= innerWidth) {
    setleft -= Number(((PICKER_WIDTH - inputWidth) / 2).toFixed(2));
  }

  return {
    top: `${Number(settop.toFixed(2))}px`,
    left: `${Number(setleft.toFixed(2))}px`,
  };
}
