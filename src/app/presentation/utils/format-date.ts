import { TuiDay, TuiDayRange } from '@taiga-ui/cdk/date-time';

export function formatDayToDate(day: TuiDay): Date {
  return new Date(Date.UTC(day.year, day.month, day.day));
}
