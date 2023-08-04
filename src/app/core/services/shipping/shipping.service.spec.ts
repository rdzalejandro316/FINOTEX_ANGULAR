import { TestBed } from '@angular/core/testing';

import { ShippingService } from './shipping.service';

describe('Shipping', () => {
  let service: ShippingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
