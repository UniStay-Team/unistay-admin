import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../../core/api.config';
import { Page } from '../../core/api.types';

// AdminListing из docs/admin-api-v1.md §4. Деньги — десятичные строки.
export interface AdminListing {
  id: number;
  owner_id: number;
  owner_name: string;
  title: string;
  description: string;
  city: string;
  district: string;
  address: string;
  university: string;
  price: string;
  deposit: string;
  utilities_included: boolean;
  capacity: number;
  move_in_date: string | null;
  status: string;
  occupied: number;
  available: number;
  group_ready: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class ListingsApi {
  private readonly http = inject(HttpClient);

  list(page: number): Observable<Page<AdminListing>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<Page<AdminListing>>(apiUrl('admin/listings/'), { params });
  }
}
