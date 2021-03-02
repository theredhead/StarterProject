import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeoutError } from 'rxjs';
import { map, tap, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  constructor(
    private notificationsService: NotificationsService,
    private http: HttpClient
  ) {}

  httpGet<T>(api: string[], then: ApiClientResonseHandler<T> = null) {
    return this.httpRequest('GET', api, null, then);
  }
  httpPost<T>(
    api: string[],
    payload: any,
    then: ApiClientResonseHandler<T> = null
  ) {
    return this.httpRequest('POST', api, payload, then);
  }
  httpPut<T>(
    api: string[],
    payload: any,
    then: ApiClientResonseHandler<T> = null
  ) {
    return this.httpRequest('PUT', api, payload, then);
  }
  httpDelete<T>(api: string[], then: ApiClientResonseHandler<T> = null) {
    return this.httpRequest('DELETE', api, null, then);
  }

  httpRequest<T>(
    method: string,
    api: string[],
    payload: T,
    then: ApiClientResonseHandler<T> = null
  ): void {
    const backend = environment.backends.main;
    const endpoint = `http://${backend.host}:${backend.port}/api/${api.join(
      '/'
    )}`;
    const headers = new HttpHeaders();
    const request: HttpRequest<T> = new HttpRequest(method, endpoint, payload, {
      responseType: 'json',
      headers,
    });
    this.http
      .request<T>(request)
      .pipe(
        timeout(1000),
        tap((e) => e.type === HttpEventType.Response),
        map((e) => e as HttpResponse<T>)
      )
      .subscribe(
        (data) => (then ? then(data.body) : () => {}),
        (error) => {
          console.error(error);
          if (error instanceof TimeoutError) {
            this.notificationsService.error(`Timeout: ${error.message}`);
          } else {
            this.notificationsService.error(`${error.message}`);
          }
        }
      );
  }
}

export type ApiClientResonseHandler<T> = (rows: T) => void;
