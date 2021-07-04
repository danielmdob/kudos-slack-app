export enum EventTypes {
  APP_MENTION = 'app_mention',
}

export enum ElementType {
  USER = 'user',
  EMOJI = 'emoji',
}

interface SlackEvent {
  type: 'app_mention';
  blocks: SlackBlock[];
  user: string;
}

export interface SlackAuthorization {
  user_id: string;
  is_bot: boolean;
}

export interface SlackAction {
  event: SlackEvent;
  authorizations: SlackAuthorization[];
}

export interface SlackElement {
  type: ElementType;
  user_id: string;
  elements: SlackElement;
  name: string;
}

export interface SlackBlock {
  elements: SlackElement[];
}

export interface AwardMentionData {
  senderId: string;
  recipientId: string;
}
