# monthpicker-lite-js

![screen](screenshots/monthpicker-light.png)
*Light mode*

Zero-dependency, lightweight datepicker component for Vanilla JS & Typescript.
---

## Installation

**Install via [NPM](https://www.npmjs.com/package/monthpicker-lite-js)**

```bash
npm i monthpicker-lite-js
```

### [Codepen Demo >](https://codepen.io/chaseottofy/pen/ZEmPdJV)

---

### Usage: Module

**Interfaces available for Typescript users.**

- The following example uses Vite.
- Some build tools require different css import schema.

```ts
import 'monthpicker-lite-js/dist/monthpicker-lite-js.css';

// vanilla js...
import { MonthPicker } from 'monthpicker-lite-js';

// typescript...
import { MonthPicker, MonthPickerInterface } ... 
```

---

### Usage: HTML

```html
<!-- CSS -->
<link rel="stylesheet" href="node_modules/monthpicker-lite-js/dist/monthpicker-lite-js.css">

<!-- JS -->
<script src="node_modules/monthpicker-lite-js/dist/monthpicker-lite-js.js"></script>

<!-- HTML -->
<div class="monthpicker"></div>
```

---

## Sections
- [Features](#features)
- [Configuration](#configuration)
- [Methods](#methods)
- [Example](#example)
- [Accessibility](#accessibility)
- [License](#license)

---

## Features

#### Zero Dependencies
- No external date handling libraries.
- No external styling libraries.
- Vanilla CSS & JS.

#### Relies solely on native Date object and DOM API
- Avoids common innerHTML pitfalls that can lead to XSS vulnerabilities.
- No need to worry about sanitizing user input.
- Does not rely on input type="date" for functionality.

#### Lightweight: CSS & JS gzipped: ~ 5-6kb

#### Accessible - [Accessibility Section](#accessibility)

#### Customizable
- Vanilla CSS allows for easy customization without the need for any SAAS/LESS/SCSS compilers.
- Easily change theme from light to dark or edit existing CSS variables.
- Customizable date format and ability to show/hide days from previous and next months.
- Customizable callbacks that fire after a date is selected.

#### Responsive
- The monthpicker will position itself in the most optimal location relative to the input element so that it is always visible.
- Accounts for scrolling, window resizing, and input focus events.
- Adjusts itself on window resize.

#### Compatible
- Supports Typescript and ES6+.
- Compatible with all modern browsers and IE11.
- Avoids date parsing that breaks on some mobile browsers.

---

## Configuration

The monthpicker constructor consists of 8 total paramters, 7 of which are optional

- [Root parameter](#params-root) -- REQUIRED --
- [Date parameter](#params-date)
- [Format parameter](#params-format)
- [Theme parameter](#params-theme)
- [Callbacks parameter](#params-callbacks)
- [CloseOnSelect parameter](#params-closeOnSelect)
- [OnlyShowCurrentMonth parameter](#params-onlyShowCurrentMonth)
- [AlignPickerMiddle parameter](#params-alignPickerMiddle)

```ts
/**
 * MonthPicker @ /src/monthpicker/monthpickerClass.ts
 * 
 * @param ROOT                  HTMLElement  : Must be in DOM
 * @param date                  Date         : Start date (default: new Date())
 * @param format                input-format : mm/dd/yyyy ect.
 * @param THEME                 string       : light or dark
 * @param callbacks             Function[]   : <Array>[callbacks]
 * @param closeOnSelect         boolean      : Close picker on date 
 * @param onlyShowCurrentMonth  boolean      : Only show current month
 * @param alignPickerMiddle     boolean      : Align Picker to middle of Input
 */

const monthpicker = new MonthPicker(
  ROOT: HTMLElement,                // REQUIRED
  date?: Date,                      // OPTIONAL - default: new Date()
  format?: string,                  // OPTIONAL - default: 'mm/dd/yyyy'
  THEME?: string,                   // OPTIONAL - default: 'dark'
  callbacks?: Function[],           // OPTIONAL - default: []
  closeOnSelect?: boolean,          // OPTIONAL - default: true
  onlyShowCurrentMonth?: boolean    // OPTIONAL - default: false
  alignPickerMiddle?: boolean       // OPTIONAL - default: false
)
```

### params-ROOT

#### -- REQUIRED --

**ROOT: HTMLElement**
- The element that the date input and monthpicker will be appended to.
- Once a variable is declared using the MonthPicker class, the rootContainer passed here will immediately be populated with both the input & monthpicker instance. (monthpicker is hidden by default)
- This is the only parameter that does not have a setter method. If you need to change the rootContainer, you will need to destroy the monthpicker and instantiate a new one with the new rootContainer.
- This can be done by calling the destroy() method on the monthpicker instance and then simply declaring a new variable with the MonthPicker class.

```html
<div class="container">
  <div class="month-picker-input-wrapper"><input /></div>
  <div class="month-picker">...</div>
</div>
```

- Note that the monthpicker is positioned absolutely and will ignore the layout of the rootContainer. 
- The position of the monthpicker is calculated based on the position of the input element. Several heuristics are used to ensure that the monthpicker is always visible - even if it has to overlap the input element or be positioned outside of the rootContainer. 
**For a more in depth explanation of the positioning logic, see [Link to Positioning Logic](https://github.com/chaseottofy/monthpicker-lite-js/blob/main/src/helpers/domHelpers.ts#L115-L221)**

- One more important note: 
  - Event Listeners are attached to the window object to allow for flexibility in terms of toggling and focus related actions. 
    - There are four listeners in total, all of which are removed when the monthpicker is destroyed.
    - Scrolling and Month navigation events are throttled @ 150ms
    - Resize events are debounced @ 50ms and have passive arguments set to true to prevent jank.

---

### params-Date

#### -- optional --

**date?: Date**
- Must be valid Date represented as a javascript Date object.
- Represents the date that the monthpicker will instantiate with.
- If no date is passed, the monthpicker will instantiate with the current date.

**Methods: @param date**
```ts
monthpicker.setDate(date: Date): void
monthpicker.getDate(): Date
monthpicker.getDateArray(): [number (year), number (month), number (day)];
monthpicker.getDateFormatted(): string (default: 'mm/dd/yyyy')
```

---

### params-format

#### -- optional --

**format?: string**
- Defaults to 'month dd, yyyy'
- Sets the format of the date input and can be accessed via the getDateFormatted() method.
- Accepts the following formats:
  - 'ddmmyyyy'
  - 'dd/mm/yyyy' 
  - 'mm/dd/yyyy' 
  - 'dd-mm-yyyy' 
  - 'mm-dd-yyyy'
  - 'month dd, yyyy' 
  - 'month dd yyyy'
  - 'mth dd yyyy' 
  - 'mth dd, yyyy'

**Methods: @param format**
```ts
monthpicker.setFormat(format: string): void
monthpicker.getFormat(): string
```

---

### params-theme

#### -- optional --

**theme?: string**
- Defaults to 'dark'
- Sets the theme of the input and monthpicker.
- Accepts either 'light' or 'dark'

**Methods: @param theme**
```ts
monthpicker.setTheme(theme: string): void
monthpicker.getTheme(): string
```

---

### params-callbacks

#### -- optional --

**callbacks?: Function[]**
- Defaults to an empty array.
- Provides a way to pass custom functions to the monthpicker that instantiate after a date is selected.
- Each callback passed in the array will have access the same parameter 'date: Date' which represents the date that was selected.
- Callbacks are called in the order that they are passed.
  
**Methods: @param callbacks**
```ts
monthpicker.setCallbacks(callbacks: Function[]): void
monthpicker.getCallbacks(): Function[]
```

---

### params-closeOnSelect

#### -- optional --

**closeOnSelect?: boolean**
- Defaults to true.
- Close the monthpicker after a date is selected.

**Methods: @param closeOnSelect**
```ts
monthpicker.setCloseOnSelect(closeOnSelect: boolean): void
monthpicker.getCloseOnSelect(): boolean
```

---

### params-onlyShowCurrentMonth

#### -- optional --

**onlyShowCurrentMonth?: boolean**
- Defaults to false.
- Rather than showing days from previous and next months for the current month, only show the days within the current month.
- (Does not affect the layout of the monthpicker, Previous/Next days of month will just be blank).

**Methods: @param onlyShowCurrentMonth**
```ts
monthpicker.setOnlyShowCurrentMonth(onlyShowCurrentMonth: boolean): void
monthpicker.getOnlyShowCurrentMonth(): boolean
```

---

### params-alignPickerMiddle

#### -- optional --

**alignPickerMiddle?: boolean**
- Defaults to false.
- Align picker to middle of input element when possible

**Methods: @param alignPickerMiddle**
```ts
monthpicker.setAlignPickerMiddle(alignPickerMiddle: boolean): void
monthpicker.getAlignPickerMiddle(): boolean
```

---

## Methods

```ts
setDate(date: Date): void;
setFormat(format: string): void;
setCallbacks(callbacks: DatepickerCallback): void;
setTheme(theme: string): void;
setCloseOnSelect(closeOnSelect: boolean): void;
setOnlyShowCurrentMonth(onlyShowCurrentMonth: boolean): void;
setAlignPickerMiddle(alignPickerMiddle: boolean): void;

getDate(): Date;
getDateArray(): number[];
getDateFormatted(format: string): string;
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
```

---

## Example

```ts
import { MonthPicker, MonthPickerInterface } from 'monthpicker-lite-js';
import 'monthpicker-lite-js/dist/monthpicker-lite-js.css';

const root = document.querySelector(`#app`) as HTMLElement;
const cb = (date: Date) => console.log(date);

const monthPicker = new MonthPicker(
  root,                // container to append picker to
  new Date(),          // start date
  [cb],                // callback (logs date after selection)
  'dark',              // theme
  'Month dd, yyyy',    // input display format
  false,               // close picker after date selection
  false,               // only show current month
  false,               // correspond picker w/ MIDDLE of input
) as MonthPickerInterface;

// Date Methods
monthPicker.setDate(new Date(2020, 1, 1));
const currentDate = monthPicker.getDate();
const [year, month, day] = monthPicker.getDateArray();
const dateFormatted = monthPicker.getDateFormatted();

// Format Methods
monthPicker.setFormat('mm/dd/yyyy');
const currentFormat = monthPicker.getFormat();

// Theme Methods
monthPicker.setTheme('light');
const currentTheme = monthPicker.getTheme();

// Callback Methods
monthPicker.setCallbacks([cb]);
const currentCallbacks = monthPicker.getCallbacks();

// CloseOnSelect Methods
monthPicker.setCloseOnSelect(false);
const currentCloseOnSelect = monthPicker.getCloseOnSelect();

// OnlyShowCurrentMonth Methods
monthPicker.setOnlyShowCurrentMonth(true);
const currentOnlyShowCurrentMonth = monthPicker.getOnlyShowCurrentMonth();

// AlignPickerMiddle Methods
monthPicker.setAlignPickerMiddle(true);
const currentAlignPickerMiddle = monthPicker.getAlignPickerMiddle();

// Destroy MonthPicker
monthPicker.destroy();

// Re-Instantiate MonthPicker
const monthPicker2 = new MonthPicker(root);

// Force MonthPicker Open
monthPicker2.open()

// Force MonthPicker Close
monthPicker2.close()

// Disable MonthPicker
monthPicker2.disable()

// Destroy second instance
monthPicker2.destroy()
// At this point, all references to former monthpickers are gone from the DOM including their associated event listeners.
```

--- 

## Accessibility

**Keyboard Support**
- Tab: Moves focus to the next focusable element. All clickable elements on the monthpicker are capable of being tabbed to.
- Escape: Closes the monthpicker.
- *Hidden elements are not focusable.*

**ARIA Support**
- Proper ARIA roles and attributes are applied to all relevant elements.
- Tested with Lighthouse and NU HTML Checker to be 100% compliant.

**Contrast**
- Both themes pass WCAG 2.1 AAA contrast ratio requirements.
- Tested with Lighthouse to be 100% compliant.

---

#### Browser Support

Compatible with all modern browsers and IE11.
All date handling is done with the native Date object and should be compatible for the foreseeable future.

---

#### Passes the following audits:
- lighthouse performance/a11y/seo/best practices (100%)
- NU HTML Checker (100%)
- PageSpeed Insights audit (100%)
- WCAG 2.1 AA/AAA contrast ratio requirements (100%)

---

![screen](screenshots/monthpicker-dark.png)
*Dark mode*

## License MIT

Copyright (c) 2023 Chase Ottofy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.