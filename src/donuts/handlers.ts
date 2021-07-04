import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from 'tslog';
import { loggerSettings } from '../support/logger';
import { DonutsService } from './DonutsService';
import { DonutsServiceImpl } from './DonutsServiceImpl';
import { SlackServiceImpl } from '../slack/SlackServiceImpl';
import { SlackService } from '../slack/SlackService';
import { DONUTS_ERROR_MESSAGE } from './constants';

let log: Logger;
let donutsService: DonutsService;
let slackService: SlackService;

const getErrorObject = (error: Error): APIGatewayProxyResult => {
  const statusCode = error.message === DONUTS_ERROR_MESSAGE ? 200 : 500;
  return {
    statusCode,
    body: error.message,
  };
};

export const awardDonut: APIGatewayProxyHandler = async ({ body, headers }) => {
  log = log || new Logger({ ...loggerSettings });
  donutsService = donutsService || new DonutsServiceImpl();
  slackService = slackService || new SlackServiceImpl();
  const donut = JSON.parse(body);
  log.info('awarding donut', donut);

  if (slackService.isSlackChallengeRequest(headers, donut)) {
    return slackService.getSlackChallengeResponse(donut);
  }
  try {
    await donutsService.awardDonut(donut);
  } catch (error) {
    return getErrorObject(error);
  }

  return {
    statusCode: 200,
    body: 'OK',
  };
};
