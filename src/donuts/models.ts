import { attribute, hashKey, table, rangeKey } from '@aws/dynamodb-data-mapper-annotations';
import { dateProvider } from '../support/dates/date.utils';

const { DONUTS_TABLE } = process.env;

@table(DONUTS_TABLE)
export class Donut {
  @rangeKey(dateProvider)
  createdAt: Date;

  @hashKey()
  senderId?: string;

  @attribute()
  recipientId?: string;
}
