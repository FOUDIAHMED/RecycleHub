import { AbstractControl, ValidationErrors } from '@angular/forms';

export function weightValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (value === null || value === undefined || value === '') {
    return null;
  }

  const weight = parseFloat(value);

  if (isNaN(weight)) {
    return { weight: 'Must be a valid number' };
  }

  if (weight <= 0) {
    return { weight: 'Weight must be greater than 0' };
  }

  if (weight > 1000) {
    return { weight: 'Weight cannot exceed 1000 kg' };
  }

  return null;
} 