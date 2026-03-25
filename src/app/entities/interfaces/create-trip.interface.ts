import { TuiDayRange } from '@taiga-ui/cdk/date-time';

export interface CreateTripFormInterface {
  location: string;
  description: string;
  dateRange: TuiDayRange;
}
