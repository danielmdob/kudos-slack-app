import { DateTime } from 'luxon';

export const utcTimestamp = (format?: string): string => {
  const now = DateTime.utc();
  return format ? now.toFormat(format) : now.toISO();
};

export const dateProvider: any = {
  defaultProvider: (): string => utcTimestamp(),
  type: 'String',
};
