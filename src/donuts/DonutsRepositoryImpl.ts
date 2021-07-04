import { DataMapper, QueryIterator } from '@aws/dynamodb-data-mapper';
import { between } from '@aws/dynamodb-expressions';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Donut } from './models';
import { DonutsRepository } from './DonutsRepository';
import { DateTime } from 'luxon';

const { AWS_REGION } = process.env;

export class DonutsRepositoryImpl implements DonutsRepository {
  constructor(private mapper: DataMapper = new DataMapper({ client: new DynamoDB({ region: AWS_REGION }) })) {}

  queryIteratorToArray = async (iterator: QueryIterator<Donut>): Promise<Donut[]> => {
    const out: Donut[] = [];
    for await (const x of iterator) {
      out.push(x);
    }
    return out;
  };

  create = async (entity: Donut): Promise<Donut> => this.mapper.put(Object.assign(new Donut(), entity));

  getCurrentDayCount(senderId: string): Promise<number> {
    const durationUnit = 'day';
    const result: QueryIterator<Donut> = this.mapper.query(Donut, {
      senderId,
      createdAt: between(DateTime.utc().startOf(durationUnit).toISO(), DateTime.utc().endOf(durationUnit).toISO()),
    });
    return this.queryIteratorToArray(result).then((array) => array.length);
  }
}
