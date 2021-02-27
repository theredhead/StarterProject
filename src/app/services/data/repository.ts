import { BehaviorSubject } from 'rxjs';
import { RepositoryAction } from './repository-action';

export abstract class Repository<T> {
  entities$ = new BehaviorSubject<T[]>([]);

  performAction(action: RepositoryAction<T>): void {
    try {
      const result = action.run(this.entities$.getValue(), this);
      this.entities$.next(result);
    } catch (error) {
      console.error('Error performing action', { action, error });
    }
  }
}
