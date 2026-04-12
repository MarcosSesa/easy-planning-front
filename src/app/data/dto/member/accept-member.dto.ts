import { MemberRoleDto } from 'app/data/dto/member/member-role.dto';
import { AcceptMemberStatus, MemberStatusDto } from 'app/data/dto/member/member-status.dto';

export interface AcceptMemberBodyDto {
  memberId: string;
  status: AcceptMemberStatus;
}
