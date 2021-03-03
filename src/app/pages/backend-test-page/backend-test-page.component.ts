import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MysqlColumnSchemaRow } from 'src/app/components/grid/grid-helpers';
import { RowEditedEvent } from 'src/app/components/grid/grid.component';
import { ApiClientService } from 'src/app/services/api-client.service';

@Component({
  selector: 'app-backend-test-page',
  templateUrl: './backend-test-page.component.html',
  styleUrls: ['./backend-test-page.component.scss'],
})
export class BackendTestPageComponent implements OnInit {
  showSchema = false;
  table = null;
  filterText = '';
  tables: string[] = [];
  rows: any[] | null = null;
  schema: any[] = [];
  pageIndex = 0;
  pageSize = 10;
  message?: string;
  error: any;
  editable = false;

  loading$: Observable<number>;

  constructor(
    private api: ApiClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading$ = this.api.loading$.asObservable();
  }

  addRow(): void {
    const defaultValue = (col: MysqlColumnSchemaRow): any => {
      if (col.COLUMN_DEFAULT === 'CURRENT_TIMESTAMP') {
        return new Date();
      }
      if (col.IS_NULLABLE === 'NO') {
        return col.COLUMN_DEFAULT ?? '';
      }
      return null;
    };
    const row: any = {};
    this.schema.forEach((col) => {
      row[col.COLUMN_NAME] = defaultValue(col);
    });
    console.log('generated new row:', row);

    // empty filterText
    this.filterText = '';
    // move to the last page
    this.pageIndex = Math.floor((this.rows.length + 1) / this.pageSize);
    // add row to the end of all items
    this.rows = [...this.rows, row];
  }
  delete(rows: any[]): void {
    const rowsLeft = this.rows.filter((r) => !rows.includes(r));
    this.rows = rowsLeft;
    while (rows.length) {
      const row = rows.pop();
      this.api.httpDelete([this.table, row.id], (d) => {
        console.log('deleted row:', d);
      });
    }
  }
  rowEdited(e: RowEditedEvent) {
    const row = e.row;
    const rowIndex = this.rows.indexOf(row);

    if (row?.lastmodified) {
      delete row.lastmodified;
    }

    if (!(row?.id ?? null)) {
      delete row.id;
      this.api.httpPost(
        [this.table],
        row,
        (savedRow: any) => (this.rows[rowIndex] = savedRow)
      );
    } else {
      this.api.httpPut(
        [this.table, row.id],
        row,
        (savedRow: any) => (this.rows[rowIndex] = savedRow)
      );
    }
    console.log(
      `Changed ${e.field} from "${e.change.previousValue}" to "${e.change.currentValue}" in row`,
      e.row
    );
  }

  reload(): void {
    console.log('Reloading table list..');
    this.api.httpGet<string[]>([], (tables) => {
      this.tables = tables;
    });
  }

  navigateTo(table: string) {
    // if (table !== this.table) {
    this.router.navigate(['/table', table]);
    // }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((map) =>
      map.has('table') ? this.assign(map.get('table'), true) : () => {}
    );
    this.reload();
  }
  private assign(table: string, forceLoad = false) {
    if (forceLoad || table !== this.table) {
      this.table = table;
      this.api.httpGet<any[]>([table, 'schema'], (schema) => {
        this.api.httpGet<any[]>([table], (rows) => {
          this.schema = schema;
          this.rows = rows;
        });
      });
    }
  }
}
