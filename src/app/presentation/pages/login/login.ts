import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginForm } from 'app/presentation/pages/login/components/login-form/login-form';
import { RegisterForm } from 'app/presentation/pages/login/components/register-form/register-form';

@Component({
  selector: 'app-login',
  imports: [TranslatePipe, ReactiveFormsModule, LoginForm, RegisterForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  protected readonly isLogin = signal(true);

  protected changeMode() {
    this.isLogin.update((isLogin) => !isLogin);
  }
}
