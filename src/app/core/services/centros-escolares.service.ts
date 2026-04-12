import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CentrosEscolaresService {
  private baseUrl = environment.API_URL || 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getCentrosEscolares(
    page = 1,
    records = 5,
    sortBy = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    search = '',
    filters: Record<string, unknown> = {}
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('records', records.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('search', search)
      .set('filters', JSON.stringify(filters));

    return this.http.get<any>(`${this.baseUrl}/api/centros-escolares`, { params });
  }

  getGruposPorCentro(centroId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/centros-escolares/${centroId}/grupos`);
  }

  getAsistenciasPorCentro(centroId: string, fechaInicio: string, fechaFin: string): Observable<any[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    return this.http.get<any[]>(`${this.baseUrl}/api/centros-escolares/${centroId}/asistencias`, {
      params,
    });
  }

  getAlumnosPorGrupo(grupoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/grupos/${grupoId}/alumnos`);
  }
}
