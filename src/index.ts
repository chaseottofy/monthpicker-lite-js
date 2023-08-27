// declare const MonthPicker: {
//     new (rootContainer?: HTMLElement, startDate?: Date, pickerCallbacks?: import("./models/interfaces").DatepickerCallback, theme?: string, format?: string, closeOnSelect?: boolean, onlyShowCurrentMonth?: boolean, alignPickerMiddle?: boolean): MonthPickerInterface;
//     prototype: MonthPickerInterface;
// };
import './monthpicker.css';
export { default as MonthPicker } from './monthpicker/monthpickerClass';
export * from './models/interfaces';
