import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  tables: string[] = [];
  rows: any[] | null = null;
  schema: any[] = [];

  message?: string;
  error: any;
  timedOut = false;

  constructor(private api: ApiClientService, private route: ActivatedRoute) {}

  addRow(): void {
    const defaultValue = (col: any): any => {
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
    this.rows.push(row);
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
