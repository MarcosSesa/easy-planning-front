import { Component } from '@angular/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core/components/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButton,
  TuiIcon,
  TuiTextfield,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
} from '@taiga-ui/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-member-dialog',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    TuiTextfieldDirective,
    TuiButton,
    TuiTextfieldComponent,
    TuiIcon,
    TuiTextfield,
  ],
  templateUrl: './add-member-dialog.html',
  styleUrl: './add-member-dialog.scss',
})
export class AddMemberDialog {
  protected readonly context = injectContext<TuiDialogContext<string, void>>();

  protected readonly memberForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  protected onSubmit(event: Event) {
    event.preventDefault();
    this.memberForm.markAllAsTouched();

    if (this.memberForm.invalid) {
      return;
    }

    const email = this.memberForm.get('email')?.value;
    if (email) {
      this.context.completeWith(email);
    }
  }
}
