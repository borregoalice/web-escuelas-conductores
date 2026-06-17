import { Component, OnInit, inject, signal } from '@angular/core';

import { EstadisticasDto } from '../core/models/estadisticas.dto';
import { EstadisticasService } from '../core/services/estadisticas.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  private readonly estadisticasService = inject(EstadisticasService);

  estadisticas = signal<EstadisticasDto | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando.set(true);
    this.error.set('');

    this.estadisticasService.obtener().subscribe({
      next: (respuesta) => {
        this.estadisticas.set(respuesta);
        this.error.set('');
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las estadísticas.');
        this.cargando.set(false);
      },
    });
  }
}
