import { FormArray, FormControl, FormGroup } from "@angular/forms";

export function markAllControlsAsDirtyAndTouched(
    formGroup: FormGroup | FormArray
  ): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty();
        control.markAsTouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        markAllControlsAsDirtyAndTouched(control);
      }
    });
  }
