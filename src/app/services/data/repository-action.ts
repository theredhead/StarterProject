import { Repository } from './repository';

export abstract class RepositoryAction<T> {
  abstract type: string;
  abstract run(data: T[], repository: Repository<T>): T[];
}
