export interface UpdateActivityResponseDto {
  created: number;
  updated: number;
}

export interface UpdateActivitiesBodyDto {
  activities: UpdateActivityDto[];
}

export interface UpdateActivityDto {
  activityId?: string;
  title: string;
  description: string;
  location: string;
  startTime: string; // DATE FORMAT
  endTime: string; // DATE FORMAT
}
