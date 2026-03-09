export interface ActivityDto {
  id: string;
  tripId: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string; // DATE FORMAT
  endTime: string; // DATE FORMAT
  createdAt: string; // DATE FORMAT
  tripDayId: string;
  createdById: string;
}
