import { Component, signal } from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import {
  TuiButton,
  TuiIcon,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiTextarea } from '@taiga-ui/kit';

@Component({
  selector: 'app-create-trip',
  imports: [
    TuiIcon,
    TranslatePipe,
    TuiTextfieldDirective,
    TuiTextfieldOptionsDirective,
    TuiButton,
    TuiTextarea,
    TuiTextfieldComponent,
    FormField,
  ],
  templateUrl: './create-trip-page.component.html',
  styleUrl: './create-trip-page.component.scss',
})
export class CreateTripPageComponent {
  protected readonly createTripFormModel = signal({
    title: '',
    description: '',
    date: '',
  });

  protected createTripForm = form(this.createTripFormModel, (field) => {
    required(field.title, { message: 'COMMON.VALIDATORS.TITLE_REQUIRED' });
    maxLength(field.title, 50, { message: 'COMMON.VALIDATORS.TITLE_MAX_LENGTH' });
    maxLength(field.description, 200, { message: 'COMMON.VALIDATORS.DESCRIPTION_MAX_LENGTH' });
  });
}
