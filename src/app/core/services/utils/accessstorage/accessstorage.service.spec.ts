/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccessstorageService } from './accessstorage.service';

describe('Service: Accessstorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessstorageService]
    });
  });

  it('should ...', inject([AccessstorageService], (service: AccessstorageService) => {
    expect(service).toBeTruthy();
  }));
});
