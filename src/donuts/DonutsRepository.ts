import { Donut } from './models';

export interface DonutsRepository {
  create(donut: Donut): Promise<Donut>;
  getCurrentDayCount(senderId: string): Promise<number>;
}
