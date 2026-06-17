import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { EntidadHabilitadaDto } from '../models/entidad-habilitada.dto';

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/entidades';

  listar(): Observable<EntidadHabilitadaDto[]> {
    return this.http.get<EntidadHabilitadaDto[]>(this.apiUrl);
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
