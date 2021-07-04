import { SlackService } from './SlackService';
import { APIGatewayProxyEventHeaders, APIGatewayProxyResult } from 'aws-lambda';
import { AwardMentionData, ElementType, SlackAction, SlackBlock, SlackElement } from './dtos';
import { Logger } from 'tslog';
import { loggerSettings } from '../support/logger';
import { WebClient } from '@slack/web-api';

const { SLACK_BOT_TOKEN } = process.env;

export class SlackServiceImpl implements SlackService {
  private static readonly SLACK_SIGNATURE_HEADER = 'X-Slack-Signature';
  private static readonly AWARD_EMOJI_NAME = 'doughnut';

  constructor(
    private log = new Logger({ ...loggerSettings }),
    private web: WebClient = new WebClient(SLACK_BOT_TOKEN),
  ) {}
  getSlackChallengeResponse({ challenge }: { challenge: string }): APIGatewayProxyResult {
    return {
      statusCode: 200,
      body: challenge,
    };
  }

  isSlackChallengeRequest(headers: APIGatewayProxyEventHeaders, body: { challenge? }): boolean {
    const headerNames = Object.keys(headers);
    return headerNames.includes(SlackServiceImpl.SLACK_SIGNATURE_HEADER) && body && body.challenge;
  }

  getSlackElements(action: SlackAction) {
    this.log.info('slack action', action);
    return this.flatten(action.event.blocks);
  }

  async getAwardMentionData(action: SlackAction, elements: SlackElement[]): Promise<AwardMentionData> {
    const senderId = action.event.user;
    const recipientId = this.getRecipientId(action, elements);

    return {
      senderId,
      recipientId,
    };
  }

  notify(recipientId: string, message: string): Promise<any> {
    return this.web.chat.postMessage({
      text: message,
      channel: recipientId,
    });
  }

  isAwardMention(slackElements: SlackElement[], awardMentionData: AwardMentionData): boolean {
    const hasAwardEmoji = slackElements.some(
      (element) => element.type === ElementType.EMOJI && element.name === SlackServiceImpl.AWARD_EMOJI_NAME,
    );
    this.log.info('is award mention', hasAwardEmoji);
    return awardMentionData.recipientId && hasAwardEmoji;
  }

  private getRecipientId(action: SlackAction, slackElements: SlackElement[]) {
    const botIds: string[] = action.authorizations
      .filter((authorization) => authorization.is_bot)
      .map((authorization) => authorization.user_id);
    const userIds = slackElements
      .filter((element) => element.type === ElementType.USER && !botIds.includes(element.user_id))
      .map((element) => element.user_id);
    return userIds[0];
  }

  private flatten(toFlatten: SlackElement[] | SlackBlock[]): SlackElement[] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return toFlatten.reduce((acc, element) => {
      acc = acc.concat(element);
      if (element.elements) {
        acc = acc.concat(this.flatten(element.elements));
        element.elements = [];
      }
      return acc;
    }, []);
  }
}
