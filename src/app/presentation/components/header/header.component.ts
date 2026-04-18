import { ChangeDetectionStrategy, Component, inject, Signal, Type } from '@angular/core';
import { TuiAlertService, TuiButton, TuiDialogService, TuiIcon } from '@taiga-ui/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthUseCase } from 'app/domain/use-cases/auth.use-case';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  TUI_CONFIRM,
  TuiAvatar,
  TuiBadgedContentComponent,
  TuiBadgeNotification,
  TuiConfirmData,
} from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { LoginFormComponent } from 'app/presentation/components/header/components/login-form/login-form.component';
import { RegisterFormComponent } from 'app/presentation/components/header/components/register-form/register-form.component';
import { filter, map, switchMap } from 'rxjs/operators';
import { PendingMembersResponseDto } from 'app/data/dto/member/pending-member.dto';
import { MemberUseCase } from 'app/domain/use-cases/member.use-case';

@Component({
  selector: 'app-header',
  imports: [
    TuiButton,
    NgOptimizedImage,
    TranslatePipe,
    RouterLink,
    TuiAvatar,
    TuiIcon,
    TuiBadgedContentComponent,
    TuiBadgeNotification,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly #authUseCase = inject(AuthUseCase);
  readonly #dialogService = inject(TuiDialogService);
  readonly #alertService = inject(TuiAlertService);
  readonly #translateService = inject(TranslateService);
  readonly #membersUseCase = inject(MemberUseCase);

  readonly isLoggedIn = toSignal(this.#authUseCase.isLogged$);
  readonly invitations: Signal<PendingMembersResponseDto[] | undefined> = toSignal(
    this.#membersUseCase.$invitations,
  );
  readonly usernameInitials: Signal<string> = toSignal(
    this.#authUseCase.tokenClaims$.pipe(
      filter(Boolean),
      map((t) =>
        t.username
          ?.split(' ')
          .map((n) => n.charAt(0).toUpperCase())
          .join(''),
      ),
    ),
    { initialValue: '' },
  );

  protected logout() {
    const data: TuiConfirmData = {
      yes: this.#translateService.instant('COMPONENTS.HEADER.LOGOUT'),
      no: this.#translateService.instant('COMPONENTS.HEADER.LOGOUT_CANCEL'),
    };

    this.#dialogService
      .open<boolean>(TUI_CONFIRM, {
        size: 's',
        label: this.#translateService.instant('COMPONENTS.HEADER.LOGOUT_CONFIRM_LABEL'),
        data,
      })
      .pipe(filter(Boolean))
      .subscribe((_result) => this.#authUseCase.logout());
  }

  protected onClick(type: 'login' | 'register') {
    const component: Type<any> = type === 'register' ? RegisterFormComponent : LoginFormComponent;
    this.#dialogService
      .open(new PolymorpheusComponent(component), { size: 'm' })
      .pipe(
        switchMap((message) =>
          this.#alertService.open('', {
            label: ` ${message}`,
            autoClose: 2000,
            appearance: 'positive',
          }),
        ),
      )
      .subscribe();
  }
}
