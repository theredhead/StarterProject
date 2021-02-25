import { Injectable } from '@angular/core';
import { SerializerService } from './serializer.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  get<T>(key: string, ifNotSet: T): T {
    const raw = localStorage.getItem(key);
    if (raw) {
      return this.serializerService.deserialize(raw) as T;
    }
    return ifNotSet;
  }
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, this.serializerService.serialize(value));
  }

  constructor(private serializerService: SerializerService) {}
}
