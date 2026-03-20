import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { TuiAlertService, TuiButton, TuiDialogService, TuiIcon } from '@taiga-ui/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthUseCase } from 'app/domain/use-cases/auth/auth.use-case';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TuiAvatar } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { LoginFormComponent } from 'app/presentation/components/header/components/login-form/login-form.component';
import { RegisterFormComponent } from 'app/presentation/components/header/components/register-form/register-form.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [TuiButton, NgOptimizedImage, TranslatePipe, RouterLink, TuiAvatar, TuiIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly #authUseCase = inject(AuthUseCase);
  readonly #dialogService = inject(TuiDialogService);
  readonly #alertService = inject(TuiAlertService);

  readonly isLoggedIn = toSignal(this.#authUseCase.isLogged);

  readonly usernameInitials = this.#authUseCase.tokenClaims?.username
    ?.split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .join('');

  protected logout() {
    this.#authUseCase.logout();
  }

  protected onClick(type: 'login' | 'register') {
    const component: Type<any> = type === 'register' ? RegisterFormComponent : LoginFormComponent;
    this.#dialogService
      .open(new PolymorpheusComponent(component), { size: 'm' })
      .pipe(
        switchMap((message) =>
          this.#alertService.open('', {
            label: ` ${message}`,
            autoClose: 3000,
            appearance: 'positive',
          }),
        ),
      )
      .subscribe();
  }
}
