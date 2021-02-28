import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { object_matches_searchtext } from '../../utilities/text-utilities';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  @Input() showHeader = true;
  @Input() editable = true;
  @Input() allowSelection = false;
  @Output() rowEdited = new EventEmitter<RowEditedEvent>();
  @Input() data: any[] = [];
  @Input() filterText = '';

  allSelected = false;
  someSelected = false;
  filterFunc: FilterPredicate;

  readonly selection = new SelectionModel<any>(true, [], true);

  get fields() {
    return Array.isArray(this.data) ? Object.keys(this.data[0] ?? []) : [];
  }

  get filteredRows(): any[] {
    return this.filterText.trim().length === 0
      ? this.data
      : this.data.filter((o) => this.filterFunc(o, this.filterText));
  }

  constructor(
    private table: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.filterFunc = (o: any, filter: string): boolean =>
      object_matches_searchtext(o, filter);
  }

  ngOnInit() {
    this.selection.changed.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  toggleAll(): void {
    if (!this.data.every((item) => this.selection.isSelected(item))) {
      this.selectAll();
    } else {
      this.deselectAll();
    }
  }
  selectAll(): void {
    console.log('selectAll');
    this.data.map((row) => this.selection.select(row));
    this.updateAllSelected();
  }
  deselectAll(): void {
    console.log('deselectAll');
    this.selection.clear();
    this.updateAllSelected();
  }
  toggleSelected(row: any): void {
    this.selection.toggle(row);
    this.updateAllSelected();
  }
  isSelected(row: any): boolean {
    return this.selection.isSelected(row);
  }
  updateAllSelected() {
    this.allSelected =
      this.data !== null &&
      this.data.length > 0 &&
      this.data.every((item) => this.selection.isSelected(item));

    this.someSelected =
      this.data.length > 0 &&
      this.selection.selected.length > 0 &&
      this.selection.selected.length !== this.data.length;

    this.changeDetectorRef.detectChanges();
  }

  update(row: any, field: string, newValue: string, firstChange = true) {
    const oldValue = row[field];
    if (oldValue === null && newValue === '') {
      return;
    }
    // eslint-disable-next-line eqeqeq
    if (newValue != String(oldValue)) {
      row[field] = newValue;
      this.rowEdited.emit(
        new RowEditedEvent(
          row,
          field,
          new SimpleChange(oldValue, newValue, firstChange)
        )
      );
    }
  }

  rollback(edit: RowEditedEvent): void {
    this.update(edit.row, edit.field, edit.change.previousValue, false);
  }

  handleKeyUp(
    ev: KeyboardEvent,
    rowIndex: number,
    fieldIndex: number,
    field: string
  ): void {
    if (!this.editable) {
      return;
    }

    if (this.isNavigationKeyPress(ev)) {
      const handlers: { [key: string]: any } = {
        ['ArrowUp']: this.handleNavigateUp,
        ['ArrowDown']: this.handleNavigateDown,
        ['ArrowLeft']: this.handleNavigateLeft,
        ['ArrowRight']: this.handleNavigateRight,
      };

      const handler = handlers[ev.key];
      if (handler) {
        handler(rowIndex, fieldIndex);
        ev.preventDefault();
        ev.cancelBubble = true;
      }
    }
  }

  isNavigationKeyPress(ev: KeyboardEvent) {
    return ev.metaKey || (ev.ctrlKey && ev.altKey);
  }

  tryNavigate(rowIndex: number, fieldIndex: number): boolean {
    const table = (this.table.nativeElement as HTMLElement).querySelector(
      'table'
    );
    // css selector indices are 1 based...
    const selector = `tbody>tr:nth-child(${rowIndex + 1})>td:nth-child(${
      fieldIndex + 1
    })>div`;
    // console.log('finding: ', selector);
    const element = table?.querySelector(selector) as HTMLDivElement;
    if (element) {
      element.focus();
      return true;
    }
    return false;
  }

  handleNavigateUp = (rowIndex: number, fieldIndex: number) => {
    this.tryNavigate(rowIndex - 1, fieldIndex);
  };

  handleNavigateDown = (rowIndex: number, fieldIndex: number) => {
    this.tryNavigate(rowIndex + 1, fieldIndex);
  };

  handleNavigateLeft = (rowIndex: number, fieldIndex: number) => {
    this.tryNavigate(rowIndex, fieldIndex - 1);
  };

  handleNavigateRight = (rowIndex: number, fieldIndex: number) => {
    this.tryNavigate(rowIndex, fieldIndex + 1);
  };

  focussed(element: HTMLDivElement) {
    requestAnimationFrame(() => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }
}

export class RowEditedEvent {
  constructor(
    readonly row: any,
    readonly field: string,
    readonly change: SimpleChange
  ) {}
}

export type FilterPredicate = (o: any, filterText: string) => boolean;
