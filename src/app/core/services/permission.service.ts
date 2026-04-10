import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../../models/paginated-response.interface';
import { Permission } from '../../models/permission';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private baseUrl = environment.API_URL || 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getPermissions(
    page = 1,
    records = 5,
    sortBy = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    search = '',
    filters: Record<string, unknown> = {}
  ): Observable<PaginatedResponse<Permission>> {
    let params = new HttpParams()
      .set('page', page)
      .set('records', records)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('search', search)
      .set('filters', JSON.stringify(filters));

    return this.http.get<PaginatedResponse<Permission>>(
      `${this.baseUrl}/api/permisos`,
      { params }
    );
  }

  getPermissionById(id: string): Observable<Permission> {
    return this.http.get<Permission>(`${this.baseUrl}/api/permisos/${id}`);
  }

  createPermission(permiso: Partial<Permission>): Observable<Permission> {
    return this.http.post<Permission>(`${this.baseUrl}/api/permisos/`, permiso);
  }

  updatePermission(id: string, permiso: Partial<Permission>) {
    return this.http.put<Permission>(`${this.baseUrl}/api/permisos/${id}`, permiso);
  }

  deletePermission(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/permisos/${id}`);
  }

  getAllActivePermissions() {
    return this.http.get<{ data: Permission[] }>(
      `${this.baseUrl}/api/permisos/activos/`
    );
  }
}
