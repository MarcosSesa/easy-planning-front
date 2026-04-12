import { MemberRoleDto } from 'app/data/dto/member/member-role.dto';
import { MemberStatusDto } from 'app/data/dto/member/member-status.dto';

export interface CreateMemberBodyDto {
  email: string;
  tripId: string;
}
