import { SlackAction } from '../slack/dtos';

export interface DonutsService {
  awardDonut(slackAction: SlackAction): Promise<void>;
}
