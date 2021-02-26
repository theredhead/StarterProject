import { Component, Input, OnInit } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'var-dump',
  templateUrl: './var-dump.component.html',
  styleUrls: ['./var-dump.component.scss'],
})
export class VarDumpComponent {
  @Input() value: any;

  get keys(): any[] {
    return Object.keys(this.value);
  }
  get template() {
    return 'tpl-' + typeof this.value;
  }
  isObject(v: any): boolean {
    return typeof v === 'object';
  }
  toggle(dd: HTMLElement) {
    dd.hidden = !dd.hidden;
  }
}
