import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslationService } from '@core/i18n/translation.service';
import { ContactService } from '@core/services/contact.service';

@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class Contacto {
  protected readonly trans = inject(TranslationService);
  private readonly fb = inject(FormBuilder);
  private readonly contactSvc = inject(ContactService);

  protected readonly sent = signal(false);
  protected readonly loading = signal(false);
  protected readonly sendError = signal(false);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected get name() {
    return this.form.controls.name;
  }
  protected get email() {
    return this.form.controls.email;
  }
  protected get message() {
    return this.form.controls.message;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.sendError.set(false);

    const { name, email, message } = this.form.value;
    this.contactSvc.send({ name: name!, email: email!, message: message! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.sent.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.sendError.set(true);
      },
    });
  }
}
