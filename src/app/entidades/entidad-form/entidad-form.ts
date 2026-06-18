import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EntidadHabilitadaDto } from '../../core/models/entidad-habilitada.dto';
import { UbigeoDto } from '../../core/models/ubigeo.dto';
import { EntidadService } from '../../core/services/entidad.service';
import { UbigeoService } from '../../core/services/ubigeo.service';

@Component({
  selector: 'app-entidad-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './entidad-form.html',
  styleUrl: './entidad-form.scss',
})
export class EntidadForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly entidadService = inject(EntidadService);
  private readonly ubigeoService = inject(UbigeoService);

  error = signal<string>('');
  ubigeos = signal<UbigeoDto[]>([]);
  modoEdicion = signal<boolean>(false);
  entidadId: number | null = null;

  formulario = this.fb.group({
    ruc: ['', [Validators.required, this.rucValido]],
    razonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    tipo: ['', [Validators.required]],
    estado: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    telefono: [''],
    correo: ['', [Validators.email]],
    codigoUbigeo: ['', [Validators.required]],
    fechaAutorizacion: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.cargarUbigeos();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.entidadId = Number(id);
      this.modoEdicion.set(true);
      this.cargarEntidad(this.entidadId);
    }
  }

  rucValido(control: AbstractControl): ValidationErrors | null {
    const valor = control.value as string | null;

    if (!valor) {
      return null;
    }

    return /^\d{11}$/.test(valor) ? null : { rucInvalido: true };
  }

  cargarUbigeos(): void {
    this.ubigeoService.listar().subscribe({
      next: (ubigeos) => {
        this.ubigeos.set(ubigeos);
      },
      error: () => {
        this.error.set('No se pudieron cargar los ubigeos.');
      },
    });
  }

  cargarEntidad(id: number): void {
    this.entidadService.obtenerPorId(id).subscribe({
      next: (entidad) => {
        const entidadConContacto = entidad as EntidadHabilitadaDto & {
          telefono?: string;
          correo?: string;
        };

        this.formulario.patchValue({
          ruc: entidad.ruc ?? '',
          razonSocial: entidad.razonSocial ?? '',
          tipo: entidad.tipo ?? '',
          estado: entidad.estado ?? '',
          direccion: entidad.direccion ?? '',
          telefono: entidadConContacto.telefono ?? '',
          correo: entidadConContacto.correo ?? '',
          codigoUbigeo: entidad.ubigeoCodigo ?? entidad.codigoUbigeo ?? '',
          fechaAutorizacion: entidad.fechaAutorizacion ?? '',
        });
      },
      error: () => {
        this.error.set('No se pudo cargar la entidad.');
      },
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const entidad = this.construirEntidad();
    const razonSocial = entidad.razonSocial ?? '';

    this.error.set('');

    this.entidadService.listar(razonSocial, 0, 100).subscribe({
      next: (pagina) => {
        const razonNormalizada = razonSocial.trim().toLowerCase();
        const duplicada = pagina.content.some((item) => {
          const mismaRazon = (item.razonSocial ?? '').trim().toLowerCase() === razonNormalizada;
          const esOtraEntidad = !this.entidadId || item.id !== this.entidadId;

          return mismaRazon && esOtraEntidad;
        });

        if (duplicada) {
          this.error.set('Ya existe una entidad con esa razón social.');
          return;
        }

        this.guardarEntidad(entidad);
      },
      error: () => {
        this.error.set('No se pudo validar si la entidad ya existe.');
      },
    });
  }

  construirEntidad(): EntidadHabilitadaDto {
    return {
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
  }

  guardarEntidad(entidad: EntidadHabilitadaDto): void {
    if (this.entidadId) {
      this.entidadService.actualizar(this.entidadId, entidad).subscribe({
        next: () => {
          alert('Entidad actualizada correctamente');
          this.router.navigate(['/entidades']);
        },
        error: () => {
          this.error.set('No se pudo actualizar la entidad.');
        },
      });

      return;
    }

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
