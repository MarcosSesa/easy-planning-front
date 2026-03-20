import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { matchField } from 'app/presentation/utils/validators/match-fields.validator';
import { TuiButton, TuiDialogContext, TuiIcon, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiPassword } from '@taiga-ui/kit';
import { AuthUseCase } from 'app/domain/use-cases/auth/auth.use-case';
import { firstValueFrom } from 'rxjs';
import { injectContext } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-register-form',
  imports: [TuiTextfield, FormField, TuiIcon, TranslatePipe, TuiPassword, TuiButton, TuiLoader],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  readonly #authUseCase = inject(AuthUseCase);
  readonly #translateService = inject(TranslateService);

  protected readonly context = injectContext<TuiDialogContext<string, string>>();

  protected readonly authFormModel = signal({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  protected authForm = form(this.authFormModel, (field) => {
    required(field.email, { message: 'COMMON.VALIDATORS.EMAIL_REQUIRED' });
    email(field.email, { message: 'COMMON.VALIDATORS.EMAIL_INVALID' });
    required(field.password, { message: 'COMMON.VALIDATORS.PASSWORD_REQUIRED' });
    minLength(field.password, 8, { message: 'COMMON.VALIDATORS.PASSWORD_MIN_LENGTH' });
    matchField(field.password, field.repeatPassword, {
      message: 'COMMON.VALIDATORS.PASSWORDS_DO_NOT_MATCH',
    });
    required(field.name, { message: 'COMMON.VALIDATORS.USERNAME_REQUIRED' });
    matchField(field.repeatPassword, field.password, {
      message: 'COMMON.VALIDATORS.PASSWORDS_DO_NOT_MATCH',
    });
  });

  protected onSubmit(event: Event) {
    event.preventDefault();
    submit(this.authForm, async () => {
      const credentials = this.authFormModel();
      try {
        const claims = await firstValueFrom(this.#authUseCase.register(credentials));
        this.context.completeWith(
          this.#translateService.instant('COMPONENTS.HEADER.REGISTER_SUCCESS', {
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
