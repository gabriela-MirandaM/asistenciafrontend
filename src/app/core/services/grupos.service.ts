import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private baseUrl = environment.API_URL || 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getGrupoPorId(grupoId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/grupos/${grupoId}`);
  }

  getAsistenciaPorGrupo(grupoId: string, fecha?: string): Observable<any[]> {
    let url = `${this.baseUrl}/api/grupos/${grupoId}/asistencia`;
    if (fecha) {
      url += `?fecha=${fecha}`;
    }
    return this.http.get<any[]>(url);
  }

  guardarAsistencia(grupoId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/grupos/${grupoId}/asistencia`, data);
  }
}
