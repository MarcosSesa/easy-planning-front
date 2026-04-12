import { Pipe, PipeTransform } from '@angular/core';
import { ActivityDto } from 'app/data/dto/activity/activity.dto';

@Pipe({
  name: 'sortActivitiesByTime',
  standalone: true,
})
export class SortActivitiesByTimePipe implements PipeTransform {
  transform(activities: ActivityDto[]): ActivityDto[] {
    return activities.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });
  }
}
