import { MemberRoleDto } from 'app/data/dto/member/member-role.dto';
import { MemberStatusDto } from 'app/data/dto/member/member-status.dto';

export interface CreateMemberResponseDto {
  id: string;
  role: MemberRoleDto;
  status: MemberStatusDto;
  invitedAt: string; // DATE FORMAT
  joinedAt: string | null; // DATE FORMAT
  tripId: string;
  userId: string;
}

export interface CreateMemberBodyDto {
  email: string;
  tripId: string;
}


