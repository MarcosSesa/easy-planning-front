import { ActivityDto } from 'app/data/dto/activity/activity.dto';

export interface TripDaysByTripIdResponseDto {
  id: string;
  date: string; // DATE FORMAT
  tripId: string;
}

export interface TripDaysByIdResponseDto {
  activities: ActivityDto[];
  id: string;
  date: string; // DATE FORMAT
  tripId: string;
}
