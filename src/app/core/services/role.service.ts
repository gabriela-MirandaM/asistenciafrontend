import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Role } from '../../models/role';
import { PaginatedResponse } from '../../models/paginated-response.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = environment.API_URL || 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  getRoles(
    page = 1,
    records = 5,
    sortBy = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    search = '',
    filters: Record<string, unknown> = {}
  ): Observable<PaginatedResponse<Role>> {
    let params = new HttpParams()
      .set('page', page)
      .set('records', records)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('search', search)
      .set('filters', JSON.stringify(filters));

    return this.http.get<PaginatedResponse<Role>>(`${this.baseUrl}/api/roles`, {
      params,
    });
  }

  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/api/roles/${id}`);
  }

  createRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}/api/roles/`, role);
  }

  updateRole(id: string, role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/api/roles/${id}`, role);
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/roles/${id}`);
  }

  getRolesActivos() {
    return this.http.get<{ data: Role[] }>(`${this.baseUrl}/api/roles/activos`);
  }
}
