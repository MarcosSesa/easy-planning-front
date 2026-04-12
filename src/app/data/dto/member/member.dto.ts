import { MemberRoleDto } from './member-role.dto';
import { MemberStatusDto } from './member-status.dto';

export interface MemberDto {
  id: string;
  role: MemberRoleDto;
  status: MemberStatusDto;
  invitedAt: string; // DATE FORMAT
  joinedAt: string | null; // DATE FORMAT
  tripId: string;
  userId: string;
}
