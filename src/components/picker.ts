import pickerConstants from '../constants/constants';

import {
  isDateValid,
  formatMonthYear,
  formatDateForInput,
  getDateArray,
  parseDateString,
  daysInMonth,
} from '../helpers/date-helpers';

import { createNavButton, throttle } from '../helpers/dom-helpers';

import {
  PickerConstantsInterface,
  DatepickerCallback,
} from '../models/interfaces';

const {
  BASE_THROTTLE,
  BASE_DAY_CLASS,
  BASE_PICKER_CLASS,
  BASE_INPUT_CLASS,
  PICKER_HEADER_CLASS,
  PICKER_TITLE_CLASS,
  PICKER_NAV_BTN_WRAPPER_CLASS,
  PICKER_NAV_BTN_PREV_CLASS,
  PICKER_NAV_BTN_NEXT_CLASS,
  PICKER_WEEKDAYS_CLASS,
  PICKER_WEEKDAY_CLASS,
  PICKER_DAYS_WRAPPER_CLASS,
  PICKER_DISABLED_CLASS,
  PICKER_SLIDE_PREFIX,
  NEXT_MONTH_CLASS,
  PREV_MONTH_CLASS,
  DISABLED_DAY_CLASS,
  SELECTED_CLASS,
  DAYS_LENGTH,
  MID_MONTH,
  DAY_NAMES,
  DEFAULT_THEME,
} = pickerConstants as PickerConstantsInterface;

/**
 * createMonthPicker
 * @param {HTMLElement} ROOT_CONTAINER       : picker/input parent
 * @param {Date}        START                : Init Date
 * @param {String}      THEME                : light or dark
 * @param {Array}       callbacks            : <Array>[callbacks]
 * @param {Boolean}     closeOnSelect        : Close picker on date pick
 * @param {Boolean}     onlyShowCurrentMonth : Populate only current
 */
const createMonthPicker = (
  ROOT_CONTAINER: HTMLElement = document.body,
  START: Date = new Date(),
  THEME: string = DEFAULT_THEME,
  callbacks: DatepickerCallback = [],
  closeOnSelect: boolean = false,
  onlyShowCurrentMonth: boolean = false,
) => {
  const inputElement = document.querySelector(
    `.${BASE_INPUT_CLASS}`,
  ) as HTMLInputElement;

  // initializes calendar instance
  const initCalendar = (
    startDate: Date,
    theme: string = DEFAULT_THEME,
  ): void => {
    const date: Date = new Date(startDate);
    let selectedDate: Date = new Date(date);

    const buildBaseContainers = (): HTMLElement[] => {
      const monthPickerHeader = document.createElement('div') as HTMLDivElement;
      monthPickerHeader.classList.add(PICKER_HEADER_CLASS);
      const monthYearDiv = document.createElement('div') as HTMLDivElement;
      monthYearDiv.classList.add(PICKER_TITLE_CLASS);
      const navButtons = document.createElement('div') as HTMLDivElement;
      navButtons.classList.add(PICKER_NAV_BTN_WRAPPER_CLASS);
      navButtons.append(
        createNavButton('Previous Month'),
        createNavButton('Next Month'),
      );
      monthPickerHeader.append(monthYearDiv, navButtons);

      const weekdaysDiv = document.createElement('div') as HTMLDivElement;
      weekdaysDiv.classList.add(PICKER_WEEKDAYS_CLASS);
      for (const weekday of DAY_NAMES) {
        const weekdayElement = document.createElement('span') as HTMLSpanElement;
        weekdayElement.classList.add(PICKER_WEEKDAY_CLASS);
        weekdayElement.textContent = weekday.slice(0, 1);
        weekdayElement.dataset.weekday = `${weekday}day`;
        weekdaysDiv.append(weekdayElement);
      }

      const monthDiv = document.createElement('div') as HTMLDivElement;
      monthDiv.classList.add(PICKER_DAYS_WRAPPER_CLASS);
      return [monthPickerHeader, weekdaysDiv, monthDiv];
    };

    const monthPicker = document.createElement('div') as HTMLDivElement;
    monthPicker.classList.add(BASE_PICKER_CLASS);
    monthPicker.classList.add(theme);
    monthPicker.dataset.pickerOpen = 'false';
    monthPicker.append(...buildBaseContainers());
    ROOT_CONTAINER.append(monthPicker);

    const monthDiv = monthPicker.querySelector(
      `.${PICKER_DAYS_WRAPPER_CLASS}`,
    ) as HTMLDivElement;
    const monthYearDiv = monthPicker.querySelector(
      `.${PICKER_TITLE_CLASS}`,
    ) as HTMLDivElement;

    const getMonthDays = (prevdate: Date): Date[] => {
      if (!isDateValid(prevdate)) { return []; }
      const result: Date[] = [];
      prevdate.setDate(1);
      while (typeof prevdate === 'object' && prevdate.getDay() > 0) {
        prevdate.setDate(prevdate.getDate() - 1);
      }
      for (let i = 0; i < DAYS_LENGTH; i += 1) {
        result.push(new Date(prevdate));
        prevdate.setDate(date.getDate() + 1);
      }
      return result;
    };

    const populateMonthDiv = (days: Date[], direction = 'none') => {
      // slide left if prev button clicked, right if next button clicked
      // 'none' for initial load
      const slideClass = `${PICKER_SLIDE_PREFIX}${direction}`;
      monthDiv.classList.add(slideClass);
      monthYearDiv.classList.add(slideClass);
      setTimeout(() => {
        monthDiv.classList.remove(slideClass);
        monthYearDiv.classList.remove(slideClass);
      }, BASE_THROTTLE);

      const [currYear, currMonth]: number[] = [
        days[MID_MONTH].getFullYear(),
        days[MID_MONTH].getMonth(),
      ];
      // take the minimum of today's day and the last day of the month to prevent overflow
      const todayDay = Math.min(selectedDate.getDate(), daysInMonth(currYear, currMonth + 1));

      // update month and year in header
      const updateDate: Date = new Date(currYear, currMonth, todayDay);
      monthYearDiv.textContent = formatMonthYear(updateDate);
      inputElement.dataset.dateValue = updateDate.toString();
      inputElement.placeholder = formatDateForInput(
        updateDate,
        inputElement.dataset.format as string,
      );

      for (const [i, day] of days.entries()) {
        const dayElement = monthDiv.children[i] as HTMLButtonElement;
        const [year, month, dayOfMonth] = getDateArray(day);
        const dayElementDate = `${year}-${month}-${dayOfMonth}`;

        // if true, dataset doesn't need to be updated
        if (dayElement.dataset.date === dayElementDate) { break; }

        dayElement.dataset.date = dayElementDate;
        dayElement.dataset.day = dayOfMonth as unknown as string;
        dayElement.setAttribute('class', BASE_DAY_CLASS);

        if (month - 1 === currMonth && dayOfMonth === todayDay) {
          dayElement.classList.add(SELECTED_CLASS);
        }
        if (month - 1 < currMonth || year < currYear) {
          dayElement.classList.add(
            onlyShowCurrentMonth ? DISABLED_DAY_CLASS : PREV_MONTH_CLASS,
          );
        }
        if (month - 1 > currMonth || year > currYear) {
          dayElement.classList.add(
            onlyShowCurrentMonth ? DISABLED_DAY_CLASS : NEXT_MONTH_CLASS,
          );
        }
      }
    };

    const handlePrevMonth = () => {
      const prevMonth = date.getMonth() - 1;
      date.setMonth(prevMonth - 1);
      selectedDate.setMonth(prevMonth - 1);
      selectedDate.setFullYear(date.getFullYear());
      populateMonthDiv(getMonthDays(date), 'right');
    };

    const handleNextMonth = () => {
      const nextMonth = date.getMonth();
      date.setMonth(nextMonth);
      selectedDate.setMonth(nextMonth);
      selectedDate.setFullYear(date.getFullYear());
      populateMonthDiv(getMonthDays(date), 'left');
    };

    const handleMonthDayClick = (e: MouseEvent): void => {
      const target = e.target as Element;
      const clickedDay: (null | HTMLButtonElement) = target.closest(`.${BASE_DAY_CLASS}`);
      // const clickedDay = target.closest(`.${BASE_DAY_CLASS}`);
      if (!clickedDay || clickedDay.classList.contains(SELECTED_CLASS)) return;

      const clickedDate = parseDateString(
        clickedDay?.dataset.date as string,
      ) as Date;
      // const clickedDate =
      const selectedDateObj: Date = new Date(selectedDate);
      const [clickedYear, clickedMonth]: number[] = [
        clickedDate.getFullYear(),
        clickedDate.getMonth(),
      ];
      const [selectedYear, selectedMonth]: number[] = [
        selectedDateObj.getFullYear(),
        selectedDateObj.getMonth(),
      ];
      // Define booleans before updating selected date
      const hasFutureYear: boolean = clickedYear > selectedYear;
      const hasPastYear: boolean = clickedYear < selectedYear;
      const hasFutureMonth: boolean = clickedMonth > selectedMonth;
      const hasPastMonth: boolean = clickedMonth < selectedMonth;
      selectedDate = clickedDate as Date;
      // **Important to check for year difference first**
      if (hasFutureYear) {
        handleNextMonth();
        return;
      }
      if (hasPastYear) {
        handlePrevMonth();
        return;
      }
      if (hasFutureMonth) {
        handleNextMonth();
        return;
      }
      if (hasPastMonth) {
        handlePrevMonth();
        return;
      }
      // Runs if above conditions are not met:
      // same month and year, avoid re-render and update selected day class
      monthDiv.querySelector(`.${SELECTED_CLASS}`)?.classList.remove(
        SELECTED_CLASS,
      );

      inputElement.dataset.dateValue = selectedDate.toString();
      inputElement.placeholder = formatDateForInput(
        selectedDate,
        inputElement.dataset.format as string,
      );
      clickedDay.classList.add(SELECTED_CLASS);
    };

    const initBaseContent = () => {
      for (let i = 0; i < DAYS_LENGTH; i += 1) {
        const dayElement = document.createElement('button') as HTMLButtonElement;
        dayElement.classList.add(BASE_DAY_CLASS);
        dayElement.ariaLabel = 'day';
        monthDiv.append(dayElement);
      } populateMonthDiv(getMonthDays(date));
    };

    // delegate through month picker instance itself
    const handleMonthDivClick = (e: MouseEvent): void => {
      const target = e.target as Element;
      const prevButton = target.closest(`.${PICKER_NAV_BTN_PREV_CLASS}`);
      const nextButton = target.closest(`.${PICKER_NAV_BTN_NEXT_CLASS}`);
      const day = target.closest(`.${BASE_DAY_CLASS}`);

      if (prevButton) { handlePrevMonth(); }
      if (nextButton) { handleNextMonth(); }
      if (day) {
        handleMonthDayClick(e);
        if (callbacks.length > 0) {
          for (const callback of callbacks) {
            callback(selectedDate);
          }
        }
        if (closeOnSelect) {
          monthPicker.classList.add(`${PICKER_DISABLED_CLASS}`);
        }
      }
    };

    initBaseContent();
    monthPicker.classList.add(`${PICKER_DISABLED_CLASS}`);
    const throttleMonthDivClick = throttle(
      handleMonthDivClick,
      BASE_THROTTLE,
    );
    monthPicker.addEventListener('click', throttleMonthDivClick);
  };

  initCalendar(START, THEME); // INIT
};

export default createMonthPicker;
