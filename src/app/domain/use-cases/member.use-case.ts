import { inject, Injectable } from '@angular/core';
import { MemberRepository } from 'app/data/repositories/member.repository';
import { CreateMemberBodyDto } from 'app/data/dto/member/create-memeber.dto';
import { AcceptMemberStatus } from 'app/data/dto/member/member-status.dto';
import { BehaviorSubject, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberUseCase {
  readonly #memberRepository = inject(MemberRepository);

  readonly #reloadInvitations$ = new BehaviorSubject<void>(undefined);

  $invitations = this.#reloadInvitations$
    .pipe(switchMap(() => this.#memberRepository.getPendingMembers()))
    .pipe(map((invitations) => invitations.data));

  inviteMember(member: CreateMemberBodyDto) {
    return this.#memberRepository.inviteMember(member);
  }

  acceptMember(memberId: string, status: AcceptMemberStatus) {
    return this.#memberRepository.acceptMember({ memberId, status });
  }

  reloadInvitations() {
    this.#reloadInvitations$.next(undefined);
  }
}
