import { inject, Injectable } from '@angular/core';
import { MemberRepository } from 'app/data/repositories/member.repository';
import { CreateMemberBodyDto } from 'app/data/dto/member/create-memeber.dto';
import { AcceptMemberStatus } from 'app/data/dto/member/member-status.dto';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberUseCase {
  readonly #memberRepository = inject(MemberRepository);

  $invitations = this.#memberRepository
    .getPendingMembers()
    .pipe(map((invitations) => invitations.data));

  inviteMember(member: CreateMemberBodyDto) {
    return this.#memberRepository.createMember(member);
  }

  acceptMember(memberId: string, status: AcceptMemberStatus) {
    return this.#memberRepository.acceptMember({ memberId, status });
  }
}
