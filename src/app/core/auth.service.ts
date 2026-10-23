import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, of, switchMap, tap, throwError } from 'rxjs';

import { apiUrl } from './api.config';

interface LoginResponse {
  token: string;
  expires_at: string;
}

export interface AdminMe {
  id: number;
  email: string;
  name: string;
  permissions: string[];
}

// Токен хранится только в памяти: перезагрузка страницы требует нового входа (admin-api-v1.md §1).
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenState = signal<string | null>(null);
  private readonly adminState = signal<AdminMe | null>(null);

  readonly token = this.tokenState.asReadonly();
  readonly admin = this.adminState.asReadonly();
  readonly isLoggedIn = computed(() => this.adminState() !== null);

  login(email: string, password: string): Observable<AdminMe> {
    this.clear();
    return this.http.post<LoginResponse>(apiUrl('auth/login/'), { email, password }).pipe(
      tap((res) => this.tokenState.set(res.token)),
      switchMap(() => this.http.get<AdminMe>(apiUrl('admin/me/'))),
      tap((admin) => this.adminState.set(admin)),
      catchError((err) => {
        // Обычный пользователь получил сессию, но не прошёл admin/me: сессию не сохраняем.
        this.revokeQuietly();
        return throwError(() => err);
      }),
    );
  }

  logout(): Observable<unknown> {
    if (!this.tokenState()) return of(null);
    return this.http.post(apiUrl('auth/logout/'), {}).pipe(
      catchError(() => of(null)),
      finalize(() => this.clear()),
    );
  }

  hasPermission(permission: string): boolean {
    return this.adminState()?.permissions.includes(permission) ?? false;
  }

  clear(): void {
    this.tokenState.set(null);
    this.adminState.set(null);
  }

  private revokeQuietly(): void {
    if (!this.tokenState()) return;
    this.http
      .post(apiUrl('auth/logout/'), {})
      .pipe(
        catchError(() => of(null)),
        finalize(() => this.clear()),
      )
      .subscribe();
  }
}
