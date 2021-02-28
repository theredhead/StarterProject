import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RowEditedEvent } from 'src/app/components/grid/grid.component';

@Component({
  selector: 'app-backend-test-page',
  templateUrl: './backend-test-page.component.html',
  styleUrls: ['./backend-test-page.component.scss'],
})
export class BackendTestPageComponent implements OnInit {
  data: any = '';

  constructor(private http: HttpClient) {}

  rowEdited(e: RowEditedEvent) {
    console.log(
      `Changed ${e.field} from "${e.change.previousValue}" to "${e.change.currentValue}" in row`,
      e.row
    );
  }

  ngOnInit(): void {
    const location = new URL(window.location.href);
    const endpoint = `http://${location.hostname}:5000/api/Heroes`;

    this.http.get(endpoint).subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        this.data = error;
      }
    );
  }
}
