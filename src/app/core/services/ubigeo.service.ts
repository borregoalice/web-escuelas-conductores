import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { UbigeoDto } from '../models/ubigeo.dto';

@Injectable({
  providedIn: 'root',
})
export class UbigeoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/ubigeos';

  listar(): Observable<UbigeoDto[]> {
    return this.http.get<UbigeoDto[]>(this.apiUrl);
  }

  obtenerPorCodigo(codigo: string): Observable<UbigeoDto> {
    return this.http.get<UbigeoDto>(`${this.apiUrl}/${codigo}`);
  }
}
