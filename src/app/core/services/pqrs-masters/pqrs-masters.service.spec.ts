import { TestBed } from '@angular/core/testing';

import { PqrsMastersService } from './pqrs-masters.service';

describe('PqrsMastersService', () => {
  let service: PqrsMastersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PqrsMastersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
