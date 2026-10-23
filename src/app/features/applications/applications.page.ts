import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { applicationStatusLabel } from '../../core/labels';
import { PAGE_SIZE, pagedList } from '../../core/paged-list';
import { Avatar } from '../../shared/avatar';
import { EmptyState } from '../../shared/empty-state';
import { PageHeader } from '../../shared/page-header';
import { AdminApplication, ApplicationsApi } from './applications.api';

@Component({
  selector: 'app-applications-page',
  imports: [DatePipe, ButtonModule, MessageModule, TableModule, TagModule, Avatar, EmptyState, PageHeader],
  templateUrl: './applications.page.html',
})
export class ApplicationsPage {
  private readonly api = inject(ApplicationsApi);

  protected readonly pageSize = PAGE_SIZE;
  protected readonly list = pagedList<AdminApplication>((page) => this.api.list(page));
  protected readonly count = computed(() => (this.list.error() ? null : this.list.count()));
  protected readonly statusLabel = applicationStatusLabel;

  protected onLazyLoad(event: TableLazyLoadEvent): void {
    this.list.load(Math.floor((event.first ?? 0) / PAGE_SIZE) + 1);
  }
}
