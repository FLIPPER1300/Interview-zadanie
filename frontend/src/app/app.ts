import { Component, OnInit, inject, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { PhoneEntry } from './phones/phone-entry';
import { PhoneForm } from './phones/phone-form';
import { PhoneList } from './phones/phone-list';
import { PhoneService } from './phones/phone.service';

@Component({
  selector: 'app-root',
  imports: [PhoneForm, PhoneList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly keycloak = inject(Keycloak);
  private readonly phoneService = inject(PhoneService);

  protected readonly username = (this.keycloak.tokenParsed?.['preferred_username'] as string) ?? '';
  protected readonly entries = signal<PhoneEntry[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.phoneService.getAll().subscribe({
      next: (entries) => {
        this.entries.set(entries);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  protected onCreated(entry: PhoneEntry): void {
    // Newest first, same order as the API returns.
    this.entries.update((list) => [entry, ...list]);
  }

  protected logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}
