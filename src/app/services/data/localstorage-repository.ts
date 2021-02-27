import { Repository } from './repository';
import { tap } from 'rxjs/operators';

export abstract class LocalStorageRepository<T> extends Repository<T> {
  abstract localStorageKey: string;

  constructor() {
    super();
    setTimeout(() => {
      this.attemptToRestore();
      this.entities$
        .pipe(
          tap((entities) => {
            try {
              localStorage.setItem(
                this.localStorageKey,
                this.serialize(entities)
              );
            } catch (e) {
              console.error('saving to localStorage failed:', e, entities);
            }
          })
        )
        .subscribe();
    }, 1);
  }

  attemptToRestore(): void {
    const json = localStorage.getItem(this.localStorageKey);
    if (json) {
      const data = this.deserialize(json);
      this.entities$.next(data);
    } else {
      console.log('no data present', this.localStorageKey);
    }
  }

  serialize(o: T[]): string {
    return JSON.stringify(o, null, 2);
  }
  deserialize(s: string): T[] {
    return JSON.parse(s);
  }
}
