import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { EntidadHabilitadaDto } from '../models/entidad-habilitada.dto';
import { PageResponseDto } from '../models/page-response.dto';

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/entidades`;
  private readonly authHeader = `Basic ${btoa('user:user123')}`;

  listar(razonSocial = ''): Observable<EntidadHabilitadaDto[]> {
    let params = new HttpParams();

    if (razonSocial.trim()) {
      params = params.set('razonSocial', razonSocial.trim());
    }

    return this.http
      .get<EntidadHabilitadaDto[] | PageResponseDto<EntidadHabilitadaDto>>(this.apiUrl, {
        headers: {
          Authorization: this.authHeader,
        },
        params,
      })
      .pipe(map((respuesta) => (Array.isArray(respuesta) ? respuesta : respuesta.content)));
  }

  obtenerPorId(id: number): Observable<EntidadHabilitadaDto> {
    return this.http.get<EntidadHabilitadaDto>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: EntidadHabilitadaDto): Observable<EntidadHabilitadaDto> {
    return this.http.post<EntidadHabilitadaDto>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: EntidadHabilitadaDto): Observable<EntidadHabilitadaDto> {
    return this.http.put<EntidadHabilitadaDto>(`${this.apiUrl}/${id}`, entidad);
  }

  actualizarParcial(id: number, cambios: Partial<EntidadHabilitadaDto>): Observable<EntidadHabilitadaDto> {
    return this.http.patch<EntidadHabilitadaDto>(`${this.apiUrl}/${id}`, cambios);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
