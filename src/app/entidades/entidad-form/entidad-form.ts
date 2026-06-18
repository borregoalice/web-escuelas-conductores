import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entidad-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './entidad-form.html',
  styleUrl: './entidad-form.scss',
})
export class EntidadForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  formulario = this.fb.group({
    razonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    tipo: ['', [Validators.required]],
    estado: ['', [Validators.required]],
    direccion: [''],
    telefono: [''],
    correo: ['', [Validators.email]],
    codigoUbigeo: ['', [Validators.required]],
  });

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    console.log(this.formulario.value);
  }

  cancelar(): void {
    this.router.navigate(['/entidades']);
  }
}
