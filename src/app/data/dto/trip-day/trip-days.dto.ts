import { ActivityDto } from 'app/data/dto/activity/activity.dto';

export interface TripDaysResponseDto {
  activities: ActivityDto[];
  id: string;
  date: string; // DATE FORMAT
  tripId: string;
}
