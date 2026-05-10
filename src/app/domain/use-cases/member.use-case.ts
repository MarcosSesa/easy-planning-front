import { inject, Injectable } from '@angular/core';
import { MemberRepository } from 'app/data/repositories/member.repository';
import { CreateMemberBodyDto } from 'app/data/dto/member/create-memeber.dto';
import { AcceptMemberStatus } from 'app/data/dto/member/member-status.dto';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { AuthUseCase } from 'app/domain/use-cases/auth.use-case';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MemberUseCase {
  readonly #memberRepository = inject(MemberRepository);
  readonly #authUseCase = inject(AuthUseCase);

  readonly #reloadInvitations$ = new BehaviorSubject<void>(undefined);

  $invitations = combineLatest([this.#authUseCase.isLogged$, this.#reloadInvitations$]).pipe(
    filter(([isLogged, _]) => isLogged),
    switchMap(() => this.#memberRepository.getPendingMembers()),
    map((invitations) => invitations.data),
  );

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
