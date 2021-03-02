import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  dateCorrectedForTimezoneOffset,
  dateOnly,
} from 'src/app/utilities/date-utilities';
import { MysqlColumnSchemaRow, mysqlDbTimeStamp } from '../grid-helpers';

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
      this.schema?.DATA_TYPE !== mysqlDbTimeStamp
    );
  }

  constructor() {}

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
