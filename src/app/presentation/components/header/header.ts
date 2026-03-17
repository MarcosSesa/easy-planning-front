import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthUseCase } from 'app/domain/use-cases/auth/auth.use-case';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [TuiButton, NgOptimizedImage, TranslatePipe, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly #authUseCase = inject(AuthUseCase);

  readonly isLoggedIn = toSignal(this.#authUseCase.isLogged);
}
