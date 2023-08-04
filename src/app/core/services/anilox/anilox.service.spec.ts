import { TestBed } from '@angular/core/testing';

import { AniloxService } from './anilox.service';

describe('AniloxService', () => {
  let service: AniloxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AniloxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
