import { FormGroup } from "@angular/forms";

export function isFieldErrors(formGroup: FormGroup, fieldName: string, errorName: string): boolean {
  return formGroup.get(fieldName)?.dirty
      && formGroup.get(fieldName)?.hasError(errorName) ? true : false;
}
