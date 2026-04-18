import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk/date-time';
import {
  TuiButton,
  tuiDateFormatProvider,
  TuiIcon,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
  TuiTextfieldDropdownDirective,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TuiCalendarRange, TuiInputDateRange, TuiTextarea, TuiTextareaLimit } from '@taiga-ui/kit';
import { TranslatePipe } from '@ngx-translate/core';
import { CreateTripFormInterface } from 'app/entities/interfaces/create-trip.interface';
import { TripDto } from 'app/data/dto/trip/trip.dto';

export type TripFormMode = 'create' | 'edit';

@Component({
  selector: 'app-trip-form',
  imports: [
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
    TuiIcon,
  ],
  providers: [tuiDateFormatProvider({ mode: 'DMY', separator: '/' })],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripFormComponent {
  readonly mode = input<TripFormMode>('create');
  readonly initialValue = input<Partial<TripDto> | null>(null);
  readonly submitLabelKey = input<string | null>(null);
  readonly formSubmit = output<CreateTripFormInterface>();
  readonly generateTripSubmit = output<CreateTripFormInterface>();

  protected readonly tripForm = new FormGroup({
    location: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    description: new FormControl('', [Validators.maxLength(200)]),
    dateRange: new FormControl<TuiDayRange | null>(null, [Validators.required]),
  });

  protected isEditing = computed(() => this.mode() === 'edit');

  protected readonly headerKey = computed(() =>
    this.isEditing() ? 'PAGES.CREATE_TRIP.TRIP_DETAILS_EDIT' : 'PAGES.CREATE_TRIP.TRIP_DETAILS',
  );
  protected readonly buttonKey = computed(() => {
    const key = this.submitLabelKey();
    if (key) return key;
    return this.isEditing() ? 'PAGES.CREATE_TRIP.UPDATE_BUTTON' : 'PAGES.CREATE_TRIP.CREATE_BUTTON';
  });

  private readonly _syncInitialValueEffect = effect(() => {
    const initial = this.initialValue();
    const startDate = new Date(initial?.startDate ?? '');
    const endDate = new Date(initial?.endDate ?? '');

    this.tripForm.reset({
      location: initial?.title ?? '',
      description: initial?.description ?? '',
      dateRange:
        initial?.startDate && initial?.endDate
          ? new TuiDayRange(
              new TuiDay(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
              new TuiDay(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
            )
          : null,
    });
  });

  protected onSubmit(event: Event) {
    event.preventDefault();
    this.tripForm.markAllAsTouched();

    if (this.tripForm.invalid) {
      return;
    }

    this.formSubmit.emit(this.tripForm.getRawValue() as CreateTripFormInterface);
  }

  protected generateTrip(event: PointerEvent) {
    event.preventDefault();
    this.tripForm.markAllAsTouched();

    if (this.tripForm.invalid) {
      return;
    }
    this.generateTripSubmit.emit(this.tripForm.getRawValue() as CreateTripFormInterface);
  }
}
