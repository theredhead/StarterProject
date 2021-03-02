import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  dateCorrectedForTimezoneOffset,
  dateOnly,
} from 'src/app/utilities/date-utilities';
import { stripSurrounding } from 'src/app/utilities/text-utilities';
import {
  MysqlColumnSchemaRow,
  mysqlDbEnum,
  mysqlDbSet,
  mysqlDbTimeStamp,
} from '../grid-helpers';

const SINGLE_QUOTE = "'";
const SINGLE_QUOTE2 = "'";
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrls: ['./grid-cell.component.scss'],
})
export class GridCellComponent {
  @Input() editable = true;
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @Input() schema: MysqlColumnSchemaRow;
  // @Input() cellConfig: CellConfigurationDelegate;

  get template(): string {
    const token = this.schema?.DATA_TYPE ?? 'default';
    switch (token) {
      case 'date':
      case 'datetime':
      case 'timestamp':
        return 'date';
      default:
        return token;
    }
  }

  get canEdit() {
    return (
      this.editable &&
      this.schema?.COLUMN_NAME !== 'id' &&
      this.schema?.DATA_TYPE !== mysqlDbTimeStamp &&
      this.schema?.PRIVILEGES.split(',').includes('update')
    );
  }

  constructor() {}

  getSetOptions(): string[] {
    if (this.schema?.DATA_TYPE === 'set') {
      return this.schema.COLUMN_TYPE.replace('set(', '')
        .replace(')', '')
        .split(',')
        .map((s) => s.substr(1, s.length - 2));
    }
    return [];
  }
  setValue() {
    return this.value.split(',').map((s) => s.trim());
  }
  isSelectedSetItem(option: string): boolean {
    return this.setValue().includes(option);
  }
  toggleSetItem(option: string) {
    const currentValue = this.setValue();
    if (currentValue.includes(option)) {
      this.handleAnyBlur(currentValue.filter((o) => o !== option).join(','));
    } else {
      this.handleAnyBlur([...currentValue, option].join(','));
    }
    return this.setValue().includes(option);
  }
  getEnumOptions(): string[] {
    if (this.schema?.DATA_TYPE === 'enum') {
      return this.schema.COLUMN_TYPE.replace('enum(', '')
        .replace(')', '')
        .split(',')
        .map((s) => s.substr(1, s.length - 2));
    }
    return [];
  }

  handleAnyBlur(value: any): void {
    console.log({
      old: this.value,
      new: value,
    });
    if (value !== this.value) {
      this.value = value;
      this.valueChange.emit(this.value);
    }
  }
  handleTextBlur(text: string): void {
    if (text !== this.value) {
      this.value = text;
      this.valueChange.emit(this.value);
    }
  }
  handleDateChange(date): void {
    // console.log('Date change:', {
    //   event,
    //   old: this.value,
    //   new: date,
    // });

    const newValue = dateOnly(date);
    const oldValue = dateOnly(this.value);

    if (newValue !== oldValue) {
      this.value = newValue;
      this.valueChange.emit(this.value);
    }
  }
  asDate(d: Date): Date {
    return d instanceof Date ? d : new Date(Date.parse(d));
  }
}
