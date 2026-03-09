import { PendingMembersResponseDto } from 'app/data/dto/member/pending-member.dto';
import { TripDto } from 'app/data/dto/trip/trip.dto';


export interface UpdateCreateTripBodyDto{
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}
