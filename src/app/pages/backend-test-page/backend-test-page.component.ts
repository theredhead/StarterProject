import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { RowEditedEvent } from 'src/app/components/grid/grid.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-backend-test-page',
  templateUrl: './backend-test-page.component.html',
  styleUrls: ['./backend-test-page.component.scss'],
})
export class BackendTestPageComponent implements OnInit, AfterViewInit {
  table = 'Heroes';
  tables: string[] = [];
  rows: any[] = [];
  schema: any[] = [];

  message?: string;
  error: any;
  timedOut = false;

  constructor(private http: HttpClient) {}

  rowEdited(e: RowEditedEvent) {
    console.log(
      `Changed ${e.field} from "${e.change.previousValue}" to "${e.change.currentValue}" in row`,
      e.row
    );
  }

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    if (this.tables.length == 0) {
      this.get([], (tables) => {
        this.tables = tables;
      });
    }
    this.assign(this.table);
  }

  private assign(table: string) {
    this.get([table], (rows) => {
      this.rows = rows;
    });
    this.get([table, 'schema'], (schema) => {
      this.schema = schema;
    });
  }
  private get(api: string[], then: (rows: any[]) => void) {
    const backend = environment.backends.main;
    const endpoint = `http://${backend.host}:${backend.port}/api/${api.join(
      '/'
    )}`;
    this.http
      .get<any[]>(endpoint)
      .pipe(timeout(1000))
      .subscribe(
        (data) => {
          then(data);
        },
        (error) => {
          console.error(error);
          if (error instanceof TimeoutError) {
            this.timedOut = true;
          }
          this.error = error;
          this.message = error.message;
        }
      );
  }
}
