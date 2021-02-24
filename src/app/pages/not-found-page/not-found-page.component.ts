import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
})
export class NotFoundPageComponent implements OnInit {
  requestedUri!: string;

  constructor() {}

  ngOnInit(): void {
    this.requestedUri = window.location.href;
  }
}
