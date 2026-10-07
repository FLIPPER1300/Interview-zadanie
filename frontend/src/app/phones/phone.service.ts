import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePhoneEntry, PhoneEntry } from './phone-entry';

@Injectable({ providedIn: 'root' })
export class PhoneService {
  private readonly http = inject(HttpClient);

  // Relative URL: served from the same origin as the app (nginx / dev-server proxy forwards it).
  private readonly baseUrl = '/api/phones';

  getAll(): Observable<PhoneEntry[]> {
    return this.http.get<PhoneEntry[]>(this.baseUrl);
  }

  create(entry: CreatePhoneEntry): Observable<PhoneEntry> {
    return this.http.post<PhoneEntry>(this.baseUrl, entry);
  }
}
