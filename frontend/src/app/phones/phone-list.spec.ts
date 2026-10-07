import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneEntry } from './phone-entry';
import { PhoneList } from './phone-list';

const entries: PhoneEntry[] = [
  {
    id: '1',
    name: 'Moje',
    number: '+421 900 111 222',
    visibility: 'Personal',
    createdBy: 'alice',
    createdAt: '2026-10-07T10:00:00Z',
    isMine: true,
  },
  {
    id: '2',
    name: 'Recepcia',
    number: '+421 2 1234 5678',
    visibility: 'Shared',
    createdBy: 'bob',
    createdAt: '2026-10-07T09:00:00Z',
    isMine: false,
  },
];

describe('PhoneList', () => {
  let fixture: ComponentFixture<PhoneList>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PhoneList);
    fixture.componentRef.setInput('entries', entries);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  const rows = () => Array.from(element.querySelectorAll('tbody tr'));
  const clickTab = async (label: string) => {
    const tab = Array.from(element.querySelectorAll<HTMLButtonElement>('[role=tab]')).find((b) =>
      b.textContent?.includes(label),
    );
    tab!.click();
    await fixture.whenStable();
  };

  it('shows all entries by default', () => {
    expect(rows().length).toBe(2);
  });

  it('filters personal entries', async () => {
    await clickTab('Osobné');
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('Moje');
  });

  it('filters shared entries and shows the author', async () => {
    await clickTab('Spoločné');
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('bob');
  });

  it('shows "ja" for own entries', () => {
    expect(rows()[0].textContent).toContain('ja');
  });
});
