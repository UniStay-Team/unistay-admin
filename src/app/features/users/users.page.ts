import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { roleLabel } from '../../core/labels';
import { PAGE_SIZE, pagedList } from '../../core/paged-list';
import { Avatar } from '../../shared/avatar';
import { EmptyState } from '../../shared/empty-state';
import { PageHeader } from '../../shared/page-header';
import { AdminUser, UsersApi } from './users.api';

@Component({
  selector: 'app-users-page',
  imports: [DatePipe, ButtonModule, MessageModule, TableModule, TagModule, Avatar, EmptyState, PageHeader],
  templateUrl: './users.page.html',
  styles: `
    .flag {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      white-space: nowrap;
    }
    .flag.yes i {
      color: var(--p-primary-color);
    }
    .flag.no {
      color: var(--p-text-muted-color);
    }
  `,
})
export class UsersPage {
  private readonly api = inject(UsersApi);

  protected readonly pageSize = PAGE_SIZE;
  protected readonly list = pagedList<AdminUser>((page) => this.api.list(page));
  protected readonly count = computed(() => (this.list.error() ? null : this.list.count()));
  protected readonly roleLabel = roleLabel;

  protected onLazyLoad(event: TableLazyLoadEvent): void {
    this.list.load(Math.floor((event.first ?? 0) / PAGE_SIZE) + 1);
  }
}
