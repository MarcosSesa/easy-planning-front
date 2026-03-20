import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TuiButton, TuiDialogContext, TuiIcon, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { TuiPassword } from '@taiga-ui/kit';
import { AuthUseCase } from 'app/domain/use-cases/auth/auth.use-case';
import { injectContext } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-login-form',
  imports: [TuiTextfield, FormField, TuiIcon, TranslatePipe, TuiPassword, TuiButton, TuiLoader],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  readonly #authUseCase = inject(AuthUseCase);
  readonly #translateService = inject(TranslateService);

  protected readonly context = injectContext<TuiDialogContext<string, string>>();

  protected readonly authFormModel = signal({
    email: '',
    password: '',
  });

  protected authForm = form(this.authFormModel, (field) => {
    required(field.email, { message: 'COMMON.VALIDATORS.EMAIL_REQUIRED' });
    email(field.email, { message: 'COMMON.VALIDATORS.EMAIL_INVALID' });
    required(field.password, { message: 'COMMON.VALIDATORS.PASSWORD_REQUIRED' });
    minLength(field.password, 8, { message: 'COMMON.VALIDATORS.PASSWORD_MIN_LENGTH' });
  });

  protected onSubmit(event: Event) {
    event.preventDefault();
    submit(this.authForm, async () => {
      const credentials = this.authFormModel();
      try {
        const claims = await firstValueFrom(this.#authUseCase.login(credentials));
        this.context.completeWith(
          this.#translateService.instant('COMPONENTS.HEADER.LOGIN_SUCCESS', {
            username: claims.username,
          }),
        );
        return undefined;
      } catch (error) {
        return [
          {
            fieldTree: this.authForm,
            kind: 'server',
            message: 'COMMON.VALIDATORS.LOGIN_FAILED',
          },
        ];
      }
    });
  }
}
