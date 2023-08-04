import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerResponseComponent } from './customer-response.component';

describe('CustomerResponseComponent', () => {
  let component: CustomerResponseComponent;
  let fixture: ComponentFixture<CustomerResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
