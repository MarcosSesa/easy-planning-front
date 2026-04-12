import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TuiTime } from '@taiga-ui/cdk/date-time';

export function timeRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startTime = control.get('startTime')?.value as TuiTime | null;
  const endTime = control.get('endTime')?.value as TuiTime | null;

  if (startTime && endTime) {
    const startMs = startTime.toAbsoluteMilliseconds();
    const endMs = endTime.toAbsoluteMilliseconds();

    if (startMs >= endMs) {
      return { timeRange: true };
    }
  }

  return null;
}
