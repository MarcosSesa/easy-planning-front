import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { AuthUseCase } from 'app/domain/use-cases/auth.use-case';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [TranslatePipe, TuiButton, TuiIcon, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  readonly #authUseCase = inject(AuthUseCase);
  readonly isLogged = toSignal(this.#authUseCase.isLogged$);
}
