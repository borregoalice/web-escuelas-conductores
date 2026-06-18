import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EstadisticasDto } from '../models/estadisticas.dto';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/estadisticas`;
  private readonly authHeader = `Basic ${btoa('user:user123')}`;

  obtener(): Observable<EstadisticasDto> {
    return this.http.get<EstadisticasDto>(this.apiUrl, {
      headers: {
        Authorization: this.authHeader,
      },
    });
  }
}
