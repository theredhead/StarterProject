import { Repository } from './repository';
import { RepositoryAction } from './repository-action';

export class AddEntityAction<T> extends RepositoryAction<T> {
  readonly type = '[Add Entity]';
  constructor(private payload: T) {
    super();
  }
  run(data: T[], repository: Repository<T>): T[] {
    return [...data, this.payload];
  }
}

export class RemoveEntityAction<T> extends RepositoryAction<T> {
  readonly type = '[Remove Entity]';
  constructor(private payload: T) {
    super();
  }
  run(data: T[], repository: Repository<T>): T[] {
    return [...data.filter((o) => o !== this.payload)];
  }
}

export class ModifyEntityAction<T> extends RepositoryAction<T> {
  readonly type = '[Modify Entity]';
  constructor(private payload: T, private matcher: KeyMatchPredicateImpl<T>) {
    super();
  }
  run(data: T[], repository: Repository<T>): T[] {
    const updated = [...data];
    const index = updated.findIndex((o) => this.matcher(o, this.payload));
    updated[index] = this.payload;
    return updated;
  }
}

export type LocalStorageRepositoryAction<T> =
  | AddEntityAction<T>
  | RemoveEntityAction<T>
  | ModifyEntityAction<T>;

export type KeyMatchPredicateImpl<T> = (a: T, b: T) => boolean;
