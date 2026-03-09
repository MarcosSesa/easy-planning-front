import { TripDto } from 'app/data/dto/trip/trip.dto';
import { TripRoleDto } from 'app/data/dto/trip/trip-role.dto';

export interface PendingMembersResponseDto {
  id: string;
  role: TripRoleDto;
  invitedAt: Date;
  trip: TripDto;
  tripId: string;
}
