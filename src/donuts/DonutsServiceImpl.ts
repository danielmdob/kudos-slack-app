import { DonutsService } from './DonutsService';
import { Donut } from './models';
import { DonutsRepository } from './DonutsRepository';
import { DonutsRepositoryImpl } from './DonutsRepositoryImpl';
import { SlackService } from '../slack/SlackService';
import { SlackServiceImpl } from '../slack/SlackServiceImpl';
import { SlackAction } from '../slack/dtos';
import { DONUTS_ERROR_MESSAGE, DONUTS_PER_DAY_LIMIT } from './constants';

export class DonutsServiceImpl implements DonutsService {
  constructor(
    private repository: DonutsRepository = new DonutsRepositoryImpl(),
    private slackService: SlackService = new SlackServiceImpl(),
  ) {}

  async awardDonut(slackAction: SlackAction): Promise<void> {
    const slackElements = this.slackService.getSlackElements(slackAction);
    const awardMentionData = await this.slackService.getAwardMentionData(slackAction, slackElements);
    if (this.slackService.isAwardMention(slackElements, awardMentionData)) {
      await this.validateDonutLimit(awardMentionData.senderId);
      await this.slackService.notify(
        awardMentionData.recipientId,
        `Congratulations! You have received a donut from <@${awardMentionData.senderId}>.`,
      );
      await this.repository.create(Object.assign(new Donut(), awardMentionData));
    }
  }

  private async validateDonutLimit(senderId: string) {
    const currentDayCount = await this.repository.getCurrentDayCount(senderId);
    if (currentDayCount === DONUTS_PER_DAY_LIMIT) {
      await this.slackService.notify(
        senderId,
        'I noticed you just tried to send a donut, but you have reached your limit for today. Please try again tomorrow.',
      );
      throw new Error(DONUTS_ERROR_MESSAGE);
    }
  }
}
