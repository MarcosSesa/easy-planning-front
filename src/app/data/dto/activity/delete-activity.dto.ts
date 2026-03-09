export interface DeleteActivityResponseDto {
  tripId: string;
  id: string;
  createdAt: string; // DATE FORMAT
  title: string;
  description: string | null;
  createdById: string;
  location: string | null;
  startTime: string; // DATE FORMAT
  endTime: string; // DATE FORMAT
  tripDayId: string;
}
