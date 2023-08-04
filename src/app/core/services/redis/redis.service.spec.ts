import { TestBed } from '@angular/core/testing';

import { TechinicalService } from './techinical.service';

describe('TechinicalService', () => {
  let service: TechinicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechinicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
