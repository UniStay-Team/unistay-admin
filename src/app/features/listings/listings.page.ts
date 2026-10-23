import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { listingStatusLabel } from '../../core/labels';
import { PAGE_SIZE, pagedList } from '../../core/paged-list';
import { Avatar } from '../../shared/avatar';
import { EmptyState } from '../../shared/empty-state';
import { PageHeader } from '../../shared/page-header';
import { AdminListing, ListingsApi } from './listings.api';

@Component({
  selector: 'app-listings-page',
  imports: [
    DatePipe,
    DecimalPipe,
    ButtonModule,
    MessageModule,
    TableModule,
    TagModule,
    Avatar,
    EmptyState,
    PageHeader,
  ],
  templateUrl: './listings.page.html',
  styles: `
    .seats {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      min-width: 6rem;
    }
    .bar {
      height: 6px;
      border-radius: 999px;
      background: var(--p-content-border-color);
      overflow: hidden;
    }
    .bar span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--p-primary-color);
    }
  `,
})
export class ListingsPage {
  private readonly api = inject(ListingsApi);

  protected readonly pageSize = PAGE_SIZE;
  protected readonly list = pagedList<AdminListing>((page) => this.api.list(page));
  protected readonly count = computed(() => (this.list.error() ? null : this.list.count()));
  protected readonly statusLabel = listingStatusLabel;

  protected occupancy(listing: AdminListing): number {
    return listing.capacity > 0 ? Math.round((listing.occupied / listing.capacity) * 100) : 0;
  }

  protected onLazyLoad(event: TableLazyLoadEvent): void {
    this.list.load(Math.floor((event.first ?? 0) / PAGE_SIZE) + 1);
  }
}
