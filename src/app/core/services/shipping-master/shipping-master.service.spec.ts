import { TestBed } from '@angular/core/testing';

import { ShippingMasterService } from './shipping-master.service';

describe('ShippingMasterService', () => {
  let service: ShippingMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
