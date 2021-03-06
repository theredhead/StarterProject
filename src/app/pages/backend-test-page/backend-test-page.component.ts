import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { RowEditedEvent } from 'src/app/components/grid/grid.component';

@Component({
  selector: 'app-backend-test-page',
  templateUrl: './backend-test-page.component.html',
  styleUrls: ['./backend-test-page.component.scss'],
})
export class BackendTestPageComponent implements OnInit, AfterViewInit {
  data: any[] = [];
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
    const location = new URL(window.location.href);
    const endpoint = `http://${location.hostname}:5000/api/Heroes`;

    this.http
      .get<any[]>(endpoint)
      .pipe(timeout(1000))
      .subscribe(
        (data) => {
          this.data = data;
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
