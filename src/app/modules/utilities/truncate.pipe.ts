import { Pipe, PipeTransform } from '@angular/core';

const DEFAULT_TRUNCATE_LENGTH = 100;
const TRUNCATE_ELLIPSIS = '…';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, length: number): string {
    length = length ?? DEFAULT_TRUNCATE_LENGTH;
    const s = String(value);
    return s.length <= length ? s : s.substring(0, length) + TRUNCATE_ELLIPSIS;
  }
}
