import { MemberRoleDto } from 'app/data/dto/member/member-role.dto';
import { AcceptMemberStatus, MemberStatusDto } from 'app/data/dto/member/member-status.dto';

export interface AcceptMemberResponseDto {
  id: string;
  role: MemberRoleDto;
  status: MemberStatusDto;
  invitedAt: string; // DATE FORMAT
  joinedAt: string | null; // DATE FORMAT
  tripId: string;
  userId: string;
}

export interface AcceptMemberBodyDto {
  memberId: string;
  status: AcceptMemberStatus;
}
