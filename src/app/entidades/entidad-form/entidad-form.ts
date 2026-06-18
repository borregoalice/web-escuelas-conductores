import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { EntidadHabilitadaDto } from '../../core/models/entidad-habilitada.dto';
import { EntidadService } from '../../core/services/entidad.service';

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
  private readonly entidadService = inject(EntidadService);

  error = signal<string>('');

  formulario = this.fb.group({
    ruc: ['', [Validators.required]],
    razonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    tipo: ['', [Validators.required]],
    estado: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    telefono: [''],
    correo: ['', [Validators.email]],
    codigoUbigeo: ['', [Validators.required]],
    fechaAutorizacion: ['', [Validators.required]],
  });

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const entidad = {
      ruc: this.formulario.controls.ruc.value ?? '',
      razonSocial: this.formulario.controls.razonSocial.value ?? '',
      tipo: this.formulario.controls.tipo.value ?? '',
      estado: this.formulario.controls.estado.value ?? '',
      direccion: this.formulario.controls.direccion.value ?? '',
      telefono: this.formulario.controls.telefono.value ?? '',
      correo: this.formulario.controls.correo.value ?? '',
      ubigeoCodigo: this.formulario.controls.codigoUbigeo.value ?? '',
      fechaAutorizacion: this.formulario.controls.fechaAutorizacion.value ?? '',
    } as EntidadHabilitadaDto;

    this.error.set('');

    this.entidadService.crear(entidad).subscribe({
      next: () => {
        alert('Entidad registrada correctamente');
        this.router.navigate(['/entidades']);
      },
      error: () => {
        this.error.set('No se pudo registrar la entidad.');
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/entidades']);
  }
}
