import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../../models/paginated-response.interface';
import { Group } from '../../models/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private baseUrl = environment.API_URL || 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getGroups(
    page = 1,
    records = 5,
    sortBy = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    search = '',
    filters: Record<string, unknown> = {}
  ): Observable<PaginatedResponse<Group>> {
    let params = new HttpParams()
      .set('page', page)
      .set('records', records)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('search', search)
      .set('filters', JSON.stringify(filters));

    return this.http.get<PaginatedResponse<Group>>(
      `${this.baseUrl}/api/grupos`,
      { params }
    );
  }

  getGrupoById(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.baseUrl}/api/grupos/${id}`);
  }

  createGroup(group: Partial<Group>): Observable<Group> {
    return this.http.post<Group>(`${this.baseUrl}/api/grupos/`, group);
  }

  updateGroup(id: string, group: Partial<Group>) {
    return this.http.put<Group>(`${this.baseUrl}/api/grupos/${id}`, group);
  }

  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/grupos/${id}`);
  }

  getGroupsActivos() {
    return this.http.get<{ data: Group[] }>(
      `${this.baseUrl}/api/grupos/activos/`
    );
  }
}
