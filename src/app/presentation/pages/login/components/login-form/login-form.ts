import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TuiButton, TuiIcon, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiPassword } from '@taiga-ui/kit';
import { firstValueFrom } from 'rxjs';
import { AuthUseCase } from 'app/domain/use-cases/auth/auth.use-case';

@Component({
  selector: 'app-login-form',
  imports: [TuiTextfield, FormField, TuiIcon, TranslatePipe, TuiPassword, TuiButton, TuiLoader],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  readonly #authUseCase = inject(AuthUseCase);

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
        await firstValueFrom(this.#authUseCase.login(credentials));
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
