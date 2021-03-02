import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable({ providedIn: 'root' })
export class CustomDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    console.log('CustomDateAdapter.parse', value);
    if (typeof value === 'string') {
      let str = null;
      if (value.indexOf('/') > -1) {
        str = value.split('/');
      } else if (value.indexOf('-') > -1) {
        str = value.split('-');
      } else if (value.indexOf('.') > -1) {
        str = value.split('.');
      }
      if (str === null) {
        return null;
      }
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      if (month > 11) {
        return new Date(year, date - 1, month + 1);
      }
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}
