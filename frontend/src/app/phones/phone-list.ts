import { Component, computed, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PhoneEntry, Visibility } from './phone-entry';

type Filter = 'All' | Visibility;

@Component({
  selector: 'app-phone-list',
  imports: [DatePipe],
  templateUrl: './phone-list.html',
  styleUrl: './phone-list.scss',
})
export class PhoneList {
  readonly entries = input.required<PhoneEntry[]>();

  protected readonly filters: { value: Filter; label: string }[] = [
    { value: 'All', label: 'Všetky' },
    { value: 'Personal', label: 'Osobné' },
    { value: 'Shared', label: 'Spoločné' },
  ];

  protected readonly filter = signal<Filter>('All');

  // Recomputed automatically whenever `entries` or `filter` changes.
  protected readonly visibleEntries = computed(() => {
    const filter = this.filter();
    return filter === 'All' ? this.entries() : this.entries().filter((e) => e.visibility === filter);
  });

  protected count(filter: Filter): number {
    return filter === 'All' ? this.entries().length : this.entries().filter((e) => e.visibility === filter).length;
  }
}
