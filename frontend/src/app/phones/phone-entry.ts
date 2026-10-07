// Mirrors the backend contracts in backend/Phonebook.Api/Endpoints/PhoneEndpoints.cs.

export type Visibility = 'Personal' | 'Shared';

export interface PhoneEntry {
  id: string;
  name: string;
  number: string;
  visibility: Visibility;
  createdBy: string;
  createdAt: string;
  isMine: boolean;
}

export interface CreatePhoneEntry {
  name: string;
  number: string;
  visibility: Visibility;
}
