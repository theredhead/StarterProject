import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SerializerService {
  serialize<T>(value: T): string {
    return JSON.stringify(value);
  }
  deserialize<T>(serialized: string): T {
    return JSON.parse(serialized) as T;
  }
  constructor() {}
}
