import { Component, effect, inject, signal, Signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiButton, TuiDialogService, TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { TuiChip, TuiTabs } from '@taiga-ui/kit';
import { toSignal } from '@angular/core/rxjs-interop';
import { MemberUseCase } from 'app/domain/use-cases/member.use-case';
import { PendingMembersResponseDto } from 'app/data/dto/member/pending-member.dto';
import { DatePipe } from '@angular/common';
import { AcceptMemberStatus } from 'app/data/dto/member/member-status.dto';
import { TripUseCase } from 'app/domain/use-cases/trip.use-case';
import { TripDto } from 'app/data/dto/trip/trip.dto';
import { AuthUseCase } from 'app/domain/use-cases/auth.use-case';

export enum TripStatus {
  ACTIVE = 'current',
  FUTURE = 'future',
  PAST = 'past',
}

export const FilterByTabIndex: Record<number, TripStatus | null> = {
  0: null,
  1: TripStatus.FUTURE,
  2: TripStatus.ACTIVE,
  3: TripStatus.PAST,
};

@Component({
  selector: 'app-my-trips',
  imports: [TranslatePipe, TuiButton, TuiIcon, RouterLink, TuiTabs, DatePipe, TuiChip],
  templateUrl: './my-trips-page.component.html',
  styleUrl: './my-trips-page.component.scss',
})
export class MyTripsPageComponent {
  readonly #membersUseCase = inject(MemberUseCase);
  readonly #tripsUseCase = inject(TripUseCase);
  readonly #authUseCase = inject(AuthUseCase);

  // WE EXPLICIT THE TYPE BECAUSE USING NEW ANGULAR TEMPLATING INFER AS ANY
  readonly userId: Signal<string | undefined> = toSignal(this.#authUseCase.userId$);
  readonly userTrips: Signal<TripDto[] | undefined> = toSignal(this.#tripsUseCase.userTrips$);
  readonly invitations: Signal<PendingMembersResponseDto[] | undefined> = toSignal(
    this.#membersUseCase.$invitations,
  );

  readonly activeIndex = signal(0);

  private readonly _onActiveIndexChange = effect(() => {
    const activeIndex = this.activeIndex();
    this.#tripsUseCase.setTipStatusFilter(FilterByTabIndex[activeIndex]);
  });

  protected resolveInvitation(memberId: string, status: AcceptMemberStatus) {
    this.#membersUseCase.acceptMember(memberId, status).subscribe({
      next: () => {
        this.#membersUseCase.reloadInvitations();
        this.#tripsUseCase.reloadUserTrips();
      },
    });
  }
}
