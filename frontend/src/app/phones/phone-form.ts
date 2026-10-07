import { Component, inject, output, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PhoneEntry, Visibility } from './phone-entry';
import { PhoneService } from './phone.service';

// Same rule as the backend; the backend still validates, this only gives faster feedback.
const PHONE_PATTERN = /^\+?[0-9][0-9 ()\-]{4,30}$/;

@Component({
  selector: 'app-phone-form',
  imports: [ReactiveFormsModule],
  templateUrl: './phone-form.html',
  styleUrl: './phone-form.scss',
})
export class PhoneForm {
  private readonly phoneService = inject(PhoneService);

  /** Emits the entry returned by the API after a successful save. */
  readonly created = output<PhoneEntry>();

  protected readonly saving = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    number: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    visibility: ['Personal' as Visibility, Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.serverError.set(null);

    this.phoneService.create(this.form.getRawValue()).subscribe({
      next: (entry) => {
        this.created.emit(entry);
        // Keep the chosen visibility, clear the rest for the next entry.
        this.form.reset({ visibility: this.form.controls.visibility.value });
        this.saving.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.serverError.set(describeError(err));
        this.saving.set(false);
      },
    });
  }

  protected showError(control: 'name' | 'number'): boolean {
    const c = this.form.controls[control];
    return c.invalid && c.touched;
  }
}

function describeError(err: HttpErrorResponse): string {
  // ASP.NET validation errors come back as { errors: { Field: ["message", ...] } }.
  const errors = err.error?.errors as Record<string, string[]> | undefined;
  if (err.status === 400 && errors) {
    return Object.values(errors).flat().join(' ');
  }
  return 'Číslo sa nepodarilo uložiť. Skúste to znova.';
}
