import { heroes } from '../../../src/data/heroes';
import { MySqlDbPool } from './mysql-db';

export class HeroesDatabaseSetup {
  constructor(private database: MySqlDbPool) {}

  async setup() {
    if (await this.database.doesTableExists('heroes')) {
    } else {
      await this.createHeroesTable();
      await this.populateHeroesTable();
    }
  }

  private async createHeroesTable() {
    await this.database.createTable(
      'heroes',
      [
        { name: 'firstName', type: 'VARCHAR(64)' },
        { name: 'middleName', type: 'VARCHAR(64)' },
        { name: 'lastName', type: 'VARCHAR(64)' },
        { name: 'nickName', type: 'VARCHAR(64)' },
        {
          name: 'gender',
          type:
            // eslint-disable-next-line @typescript-eslint/quotes
            "ENUM('Male', 'Female', 'Nonbinary', 'Unspecified') NOT NULL DEFAULT 'Unspecified'",
        },
        { name: 'birth', type: 'DATE NULL' },
        { name: 'death', type: 'DATE NULL' },
      ],
      true
    );
  }

  private async populateHeroesTable() {
    heroes.forEach((hero) => {
      this.database.insert('heroes', hero);
    });
  }
}
