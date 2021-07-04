import { APIGatewayProxyEventHeaders, APIGatewayProxyResult } from 'aws-lambda';
import { AwardMentionData, SlackAction, SlackElement } from './dtos';

export interface SlackService {
  isSlackChallengeRequest(headers: APIGatewayProxyEventHeaders, body: { challenge? }): boolean;
  getSlackChallengeResponse(body: { challenge: string }): APIGatewayProxyResult;
  getAwardMentionData(action: SlackAction, elements: SlackElement[]): Promise<AwardMentionData>;
  notify(recipientId: string, message: string): Promise<any>;
  isAwardMention(slackElements: SlackElement[], awardMentionData: AwardMentionData): boolean;
  getSlackElements(action: SlackAction);
}
