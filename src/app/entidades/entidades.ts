import { FormsModule } from '@angular/forms';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { EntidadHabilitadaDto } from '../core/models/entidad-habilitada.dto';
import { EntidadService } from '../core/services/entidad.service';
import { TipoEntidadPipe } from '../shared/pipes/tipo-entidad.pipe';

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [FormsModule, TipoEntidadPipe],
  templateUrl: './entidades.html',
  styleUrl: './entidades.scss',
})
export class Entidades implements OnInit {
  private readonly entidadService = inject(EntidadService);
  private readonly router = inject(Router);

  entidades = signal<EntidadHabilitadaDto[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');
  razonSocialBusqueda = signal<string>('');
  paginaActual = signal<number>(0);
  totalPaginas = signal<number>(0);
  totalElementos = signal<number>(0);
  tamanioPagina = signal<number>(5);

  ngOnInit(): void {
    this.cargarEntidades();
  }

  cargarEntidades(): void {
    this.cargando.set(true);
    this.error.set('');

    this.entidadService
      .listar(this.razonSocialBusqueda(), this.paginaActual(), this.tamanioPagina())
      .subscribe({
        next: (pagina) => {
          this.entidades.set(pagina.content);
          this.paginaActual.set(pagina.number);
          this.totalPaginas.set(pagina.totalPages);
          this.totalElementos.set(pagina.totalElements);
          this.error.set('');
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar las entidades.');
          this.cargando.set(false);
        },
      });
  }

  buscar(): void {
    this.paginaActual.set(0);
    this.cargarEntidades();
  }

  limpiar(): void {
    this.razonSocialBusqueda.set('');
    this.paginaActual.set(0);
    this.cargarEntidades();
  }

  paginaAnterior(): void {
    if (this.paginaActual() === 0) {
      return;
    }

    this.paginaActual.update((pagina) => pagina - 1);
    this.cargarEntidades();
  }

  paginaSiguiente(): void {
    if (this.paginaActual() >= this.totalPaginas() - 1) {
      return;
    }

    this.paginaActual.update((pagina) => pagina + 1);
    this.cargarEntidades();
  }

  eliminar(entidad: EntidadHabilitadaDto): void {
    if (!entidad.id) {
      this.error.set('No se pudo identificar la entidad a eliminar.');
      return;
    }

    const confirmado = confirm('¿Seguro que deseas eliminar esta entidad?');

    if (!confirmado) {
      return;
    }

    this.entidadService.eliminar(entidad.id).subscribe({
      next: () => {
        this.cargarEntidades();
      },
      error: () => {
        this.error.set('No se pudo eliminar la entidad.');
      },
    });
  }

  nuevaEntidad(): void {
    this.router.navigate(['/entidades/nuevo']);
  }

  editar(entidad: EntidadHabilitadaDto): void {
    if (!entidad.id) {
      this.error.set('No se pudo identificar la entidad a editar.');
      return;
    }

    this.router.navigate(['/entidades', entidad.id, 'editar']);
  }
}
