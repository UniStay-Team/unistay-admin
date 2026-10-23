import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../../core/api.config';
import { Page } from '../../core/api.types';

// AdminApplication из docs/admin-api-v1.md §4.
export interface AdminApplication {
  id: number;
  student_id: number;
  student_name: string;
  listing_id: number;
  listing_title: string;
  status: string;
  message: string;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsApi {
  private readonly http = inject(HttpClient);

  list(page: number): Observable<Page<AdminApplication>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<Page<AdminApplication>>(apiUrl('admin/applications/'), { params });
  }
}
