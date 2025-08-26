import { UI } from 'config/ui';
import { DAY, WEEK, MONTH } from 'modules/media/constants/periods';
import { MediaDevicesListRoutingPagitnationProps } from 'modules/media/hooks/MediaListHooks';
import queryString from 'query-string';

export function getDefaultMediaDevicesListPath(): string {
  let config: Partial<MediaDevicesListRoutingPagitnationProps> = {
    s: UI.TABLES.ROWS_PER_PAGE_DEFAULT_SELECTED,
    o: 0,
    c: []
  };

  const path = `/media/list/?${queryString.stringify(config)}`;
  return path;
}

export function calculateSelectedPeriod(fromTs: number, toTs: number) {
  const periodInMs = toTs - fromTs;

  if (periodInMs <= 24 * 60 * 60 * 1000) {
    return DAY;
  } else if (periodInMs <= 7 * 24 * 60 * 60 * 1000) {
    return WEEK;
  } else if (periodInMs <= 30 * 24 * 60 * 60 * 1000) {
    return MONTH;
  }
};