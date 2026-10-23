import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../../core/api.config';
import { Page } from '../../core/api.types';

// AdminUser из docs/admin-api-v1.md §4.
export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  email_verified: boolean;
  is_active: boolean;
  is_admin: boolean;
  date_joined: string;
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly http = inject(HttpClient);

  list(page: number): Observable<Page<AdminUser>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<Page<AdminUser>>(apiUrl('admin/users/'), { params });
  }
}
