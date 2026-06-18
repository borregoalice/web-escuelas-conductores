import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UbigeoDto } from '../models/ubigeo.dto';

@Injectable({
  providedIn: 'root',
})
export class UbigeoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/ubigeos`;
  private readonly authHeader = `Basic ${btoa('user:user123')}`;

  listar(): Observable<UbigeoDto[]> {
    return this.http.get<UbigeoDto[]>(this.apiUrl, {
      headers: {
        Authorization: this.authHeader,
      },
    });
  }

  obtenerPorCodigo(codigo: string): Observable<UbigeoDto> {
    return this.http.get<UbigeoDto>(`${this.apiUrl}/${codigo}`);
  }
}
