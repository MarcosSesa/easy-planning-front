import { injectContext } from '@taiga-ui/polymorpheus';
import { Component, output } from '@angular/core';
import { TripFormComponent } from 'app/presentation/components/trip-form/trip-form.component';
import { TuiDialogContext } from '@taiga-ui/core/components/dialog';
import { TripDto } from 'app/data/dto/trip/trip.dto';
import { CreateTripFormInterface } from 'app/entities/interfaces/create-trip.interface';

@Component({
  selector: 'app-edit-trip-dialog',
  imports: [TripFormComponent],
  templateUrl: './edit-trip-dialog.component.html',
  styleUrl: './edit-trip-dialog.component.scss',
})
export class EditTripDialog {
  protected readonly context =
    injectContext<TuiDialogContext<CreateTripFormInterface & { id: string }, TripDto>>();
  protected tripData = this.context.data;

  onFormSubmit($event: CreateTripFormInterface) {
    this.context.completeWith({ ...$event, id: this.tripData.id });
  }
}
