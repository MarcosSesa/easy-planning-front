export interface TripDto {
  id: string;
  createdAt: string; // DATE FORMAT
  title: string;
  description: string | null;
  startDate: string; // DATE FORMAT
  endDate: string; // DATE FORMAT
  createdById: string;
}
