import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../../models/user.interface';
import { PaginatedResponse } from '../../models/paginated-response.interface';
import { RoleAssignment } from '../../models/role-assignment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.API_URL || 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getUsers(
    page = 1,
    records = 5,
    sortBy = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    search = '',
    filters: Record<string, unknown> = {}
  ): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('page', page)
      .set('records', records)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('search', search)
      .set('filters', JSON.stringify(filters));

    return this.http.get<PaginatedResponse<User>>(`${this.baseUrl}/api/users`, {
      params,
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/users/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/users/`, user);
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/api/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/users/${id}`);
  }

  getUserRoles(userId: string) {
    return this.http.get<RoleAssignment[]>(
      `${this.baseUrl}/api/users/${userId}/roles`
    );
  }

  asignarRoles(userId: string, roleIds: string[]) {
    return this.http.post<{
      message: string;
      data: { userId: number; roles: string[] };
    }>(`${this.baseUrl}/api/users/${userId}/roles`, { roleIds });
  }

  eliminarRoles(userId: string, roleId: string) {
    return this.http.delete(
      `${this.baseUrl}/api/users/${userId}/roles/${roleId}`
    );
  }
}
