import { Component, OnInit, inject, signal } from '@angular/core';

import { EntidadHabilitadaDto } from '../core/models/entidad-habilitada.dto';
import { EntidadService } from '../core/services/entidad.service';

@Component({
  selector: 'app-entidades',
  standalone: true,
  templateUrl: './entidades.html',
  styleUrl: './entidades.scss',
})
export class Entidades implements OnInit {
  private readonly entidadService = inject(EntidadService);

  entidades = signal<EntidadHabilitadaDto[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    this.cargarEntidades();
  }

  cargarEntidades(): void {
    this.cargando.set(true);
    this.error.set('');

    this.entidadService.listar().subscribe({
      next: (entidades) => {
        this.entidades.set(entidades);
        this.error.set('');
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las entidades.');
        this.cargando.set(false);
      },
    });
  }
}
