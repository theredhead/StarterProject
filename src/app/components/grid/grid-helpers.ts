import { guard } from 'src/app/utilities/guard';
import { inflector } from 'src/app/utilities/inflector';

// eslint-disable-next-line no-shadow
export const enum GridCellType {
  stringCell,
  integerCell,
  flaotCell,
  dateCell,
  timeCell,
  dateTimeCell,
  booleanCell,
  selectCell,
}

//  mysqlDbType {
//Exact numeric types
export const mysqlDbInteger = 'INTEGER';
export const mysqlDbInt = 'INT';
export const mysqlDbSmallInt = 'SMALLINT';
export const mysqlDbTinyInt = 'TINYINT';
export const mysqlDbMediumInt = 'MEDIUMINT';
export const mysqlDbBigInt = 'BIGINT';
export const mysqlDbBit = 'BIT';

// Fixed point types
export const mysqlDbDecimal = 'DECIMAL';
export const mysqlDbNumeric = 'NUMERIC';

// approximate numeric types
export const mysqlDbFloat = 'FLOAT';
export const mysqlDbDouble = 'DOUBLE';

//Date and time types
export const mysqlDbDate = 'DATE';
export const mysqlDbTime = 'TIME';
export const mysqlDbYear = 'YEAR';
export const mysqlDbDateTime = 'DATETIME';
export const mysqlDbTimeStamp = 'TIMESTAMP';

// String types
export const mysqlDbChar = 'CHAR';
export const mysqlDbVarChar = 'VARCHAR';
// Text
export const mysqlDbTinyText = 'TINYTEXT';
export const mysqlDbText = 'TEXT';
export const mysqlDbMediumText = 'MEDIUMTEXT';
export const mysqlDbLongText = 'LONGTEXT';
// Binary
export const mysqlDbTinyBlob = 'TINYBLOB';
export const mysqlDbBlob = 'BLOB';
export const mysqlDbMediumBlob = 'MEDIUMBLOB';
export const mysqlDbLongBlob = 'LONGBLOB';

export const mysqlDbEnum = 'ENUM';
export const mysqlDbSet = 'SET';

export const knownMysqlDbTypes = [
  mysqlDbInteger,
  mysqlDbInt,
  mysqlDbSmallInt,
  mysqlDbTinyInt,
  mysqlDbMediumInt,
  mysqlDbBigInt,
  mysqlDbBit,
  mysqlDbDecimal,
  mysqlDbNumeric,
  mysqlDbFloat,
  mysqlDbDouble,
  mysqlDbDate,
  mysqlDbTime,
  mysqlDbYear,
  mysqlDbDateTime,
  mysqlDbTimeStamp,
  mysqlDbChar,
  mysqlDbVarChar,
  mysqlDbTinyText,
  mysqlDbText,
  mysqlDbMediumText,
  mysqlDbLongText,
  mysqlDbTinyBlob,
  mysqlDbBlob,
  mysqlDbMediumBlob,
  mysqlDbLongBlob,
  mysqlDbEnum,
  mysqlDbSet,
];

interface CellConfig {
  template: string;
  maxLength?: number;
  field?: {
    dataType: string;
  };
}

const mysqlDbTypeCellTypeMap: { [key: string]: CellConfig | null } = {
  [mysqlDbInteger]: { template: 'tpl-integer' },
  [mysqlDbInt]: { template: 'tpl-integer' },
  [mysqlDbSmallInt]: { template: 'tpl-integer' },
  [mysqlDbTinyInt]: { template: 'tpl-integer' },
  [mysqlDbMediumInt]: { template: 'tpl-integer' },
  [mysqlDbBigInt]: { template: 'tpl-integer' },
  [mysqlDbBit]: { template: 'tpl-binaryflags' },
  [mysqlDbDecimal]: { template: 'tpl-fixed' },
  [mysqlDbNumeric]: { template: 'tpl-fixed' },
  [mysqlDbFloat]: { template: 'tpl-float' },
  [mysqlDbDouble]: { template: 'tpl-float' },
  [mysqlDbDate]: { template: 'tpl-date' },
  [mysqlDbTime]: { template: 'tpl-time' },
  [mysqlDbYear]: { template: 'tpl-integer' },
  [mysqlDbDateTime]: { template: 'tpl-datetime' },
  [mysqlDbTimeStamp]: { template: 'tpl-datetime' },
  [mysqlDbChar]: { template: 'tpl-string' },
  [mysqlDbVarChar]: { template: 'tpl-string', maxLength: 255 },
  [mysqlDbTinyText]: { template: 'tpl-string', maxLength: 255 },
  [mysqlDbText]: { template: 'tpl-string', maxLength: 65535 },
  [mysqlDbMediumText]: { template: 'tpl-string', maxLength: 16_777_215 },
  [mysqlDbLongText]: { template: 'tpl-string', maxLength: 4_294_967_295 },
  [mysqlDbTinyBlob]: { template: 'tpl-binary' },
  [mysqlDbBlob]: { template: 'tpl-binary' },
  [mysqlDbMediumBlob]: { template: 'tpl-binary' },
  [mysqlDbLongBlob]: { template: 'tpl-binary' },
  [mysqlDbEnum]: { template: 'tpl-enum' },
  [mysqlDbSet]: { template: 'tpl-set' },
};

interface ValueTransformer<T> {
  fromDisplay(value: any): T | null;
  toDisplay(value: T): any;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const dbTypeToCellType = (field: { DATA_TYPE: string }): any => {
  guard('Invalid field').enforce(field).containsKey('DATA_TYPE');
  guard('Unknown datatype')
    .enforce(field.DATA_TYPE)
    .isInArray(knownMysqlDbTypes);

  return mysqlDbTypeCellTypeMap[field.DATA_TYPE];
};

const pascalizeObjectKeys = (o: any): any => {
  const result: any = {};
  Object.keys(o).forEach((k) => {
    result[inflector.pascalize(k)] = o[k];
  });
};

export interface MysqlColumnSchemaRow {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  TABLE_CATALOG: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  TABLE_SCHEMA: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  TABLE_NAME: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  COLUMN_NAME: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ORDINAL_POSITION: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  COLUMN_DEFAULT: string | null;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  IS_NULLABLE: 'YES' | 'NO';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DATA_TYPE: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CHARACTER_MAXIMUM_LENGTH: null;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CHARACTER_OCTET_LENGTH: null;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NUMERIC_PRECISION: 20;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NUMERIC_SCALE: 0;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CHARACTER_SET_NAME: null;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  COLLATION_NAME: null;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  COLUMN_TYPE: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  COLUMN_KEY: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  EXTRA: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PRIVILEGES: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  COLUMN_COMMENT: string;
}
