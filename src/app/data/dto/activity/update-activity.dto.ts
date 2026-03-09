
export interface UpdateActivityResponseDto {
  created: number;
  updated: number;
}

export interface UpdateActivityBodyDto {
  activities: BodyActivityDto[];
}

interface BodyActivityDto {
  activityId: string;
  title: string;
  description: string;
  location: string;
  startTime: string; // DATE FORMAT
  endTime: string; // DATE FORMAT
}
