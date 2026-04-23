import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TuiAlertService, TuiIcon, TuiLoader } from '@taiga-ui/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TripUseCase } from 'app/domain/use-cases/trip.use-case';
import { CreateTripFormInterface } from 'app/entities/interfaces/create-trip.interface';
import { Router } from '@angular/router';
import { TripFormComponent } from 'app/presentation/components/trip-form/trip-form.component';

@Component({
  selector: 'app-create-trip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiIcon, TranslatePipe, TripFormComponent, TuiLoader],
  templateUrl: './create-trip-page.component.html',
  styleUrl: './create-trip-page.component.scss',
})
export class CreateTripPageComponent {
  readonly #tripUseCase = inject(TripUseCase);
  readonly #alertService = inject(TuiAlertService);
  readonly #translateService = inject(TranslateService);
  readonly #router = inject(Router);

  protected readonly loading = signal(false);

  protected onSubmit(tripInfo: CreateTripFormInterface) {
    this.#tripUseCase.createTrip(tripInfo).subscribe({
      next: (res) => {
        this.#alertService
          .open('', {
            label: this.#translateService.instant('PAGES.CREATE_TRIP.SUCCESS_MESSAGE'),
            autoClose: 3000,
            appearance: 'positive',
          })
          .subscribe();
        this.#router.navigate([`/trip/${res.data.id}`]);
      },
      error: (err) =>
        this.#alertService
          .open('', {
            label: err.message,
            autoClose: 3000,
            appearance: 'negative',
          })
          .subscribe(),
    });
  }

  protected onGenerateTrip(tripInfo: CreateTripFormInterface) {
    this.loading.set(true);
    this.#tripUseCase.generateTrip(tripInfo).subscribe({
      next: (created) => {
        this.#alertService
          .open('', {
            label: this.#translateService.instant('PAGES.CREATE_TRIP.SUCCESS_MESSAGE'),
            autoClose: 3000,
            appearance: 'positive',
          })
          .subscribe();
        this.loading.set(false);
        this.#router.navigate([`/trip/${created.data.id}`]);
      },
      error: (err) => {
        this.loading.set(false);
        this.#alertService
          .open('', {
            label: err.message,
            autoClose: 3000,
            appearance: 'negative',
          })
          .subscribe();
      },
    });
  }
}
