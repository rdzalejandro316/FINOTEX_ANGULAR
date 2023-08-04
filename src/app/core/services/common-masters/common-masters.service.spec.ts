import { TestBed } from '@angular/core/testing';

import { CommonMastersService } from './common-masters.service';

describe('CommonMastersService', () => {
  let service: CommonMastersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonMastersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
