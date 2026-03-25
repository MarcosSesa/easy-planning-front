import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  TuiAlertService,
  TuiButton,
  tuiDateFormatProvider,
  TuiIcon,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
  TuiTextfieldDropdownDirective,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiCalendarRange, TuiInputDateRange, TuiTextarea, TuiTextareaLimit } from '@taiga-ui/kit';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiDayRange } from '@taiga-ui/cdk/date-time';
import { TripUseCase } from 'app/domain/use-cases/trip/trip.use-case';
import { CreateTripFormInterface } from 'app/entities/interfaces/create-trip.interface';

@Component({
  selector: 'app-create-trip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TuiIcon,
    TranslatePipe,
    TuiTextfieldDirective,
    TuiTextfieldOptionsDirective,
    TuiTextfieldDropdownDirective,
    TuiButton,
    TuiTextarea,
    TuiTextfieldComponent,
    TuiTextareaLimit,
    TuiInputDateRange,
    ReactiveFormsModule,
    FormsModule,
    TuiCalendarRange,
  ],
  providers: [tuiDateFormatProvider({ mode: 'YMD', separator: '/' })],
  templateUrl: './create-trip-page.component.html',
  styleUrl: './create-trip-page.component.scss',
})
export class CreateTripPageComponent {
  readonly #tripUseCase = inject(TripUseCase);
  readonly #alertService = inject(TuiAlertService);
  readonly #translateService = inject(TranslateService);

  protected createTripForm = new FormGroup({
    location: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    description: new FormControl('', [Validators.maxLength(200)]),
    dateRange: new FormControl<TuiDayRange | null>(null, [Validators.required]),
  });

  protected onSubmit() {
    if (this.createTripForm.valid) {
      // We can assert type because the previous check and the validations
      const tripInfo = this.createTripForm.value as CreateTripFormInterface;
      this.#tripUseCase.createTrip(tripInfo).subscribe({
        next: (_res) =>
          this.#alertService
            .open('', {
              label: this.#translateService.instant('PAGES.CREATE_TRIP.SUCCESS_MESSAGE'),
              autoClose: 3000,
              appearance: 'positive',
            })
            .subscribe(),
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
  }
}
