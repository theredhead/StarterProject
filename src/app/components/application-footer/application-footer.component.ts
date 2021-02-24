import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-application-footer',
  templateUrl: './application-footer.component.html',
  styleUrls: ['./application-footer.component.scss'],
})
export class ApplicationFooterComponent implements OnInit {
  readonly environment = environment;
  constructor() {}

  ngOnInit(): void {}
}
