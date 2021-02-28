import { Component, Input, OnInit } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'var-dump',
  templateUrl: './var-dump.component.html',
  styleUrls: ['./var-dump.component.scss'],
})
export class VarDumpComponent {
  @Input() value: any;
  @Input() maxDepth = 5;

  get keys(): any[] {
    return Object.keys(this.value);
  }
  get template() {
    if (this.value == null) {
      return 'tpl-null';
    }
    return 'tpl-' + typeof this.value;
  }
  isObject(v: any): boolean {
    return typeof v === 'object';
  }
  toggle(dd: HTMLElement) {
    dd.hidden = !dd.hidden;
  }
}
