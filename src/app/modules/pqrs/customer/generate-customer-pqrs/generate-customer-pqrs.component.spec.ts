import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCustomerPqrsComponent } from './generate-customer-pqrs.component';

describe('GenerateCustomerPqrsComponent', () => {
  let component: GenerateCustomerPqrsComponent;
  let fixture: ComponentFixture<GenerateCustomerPqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateCustomerPqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateCustomerPqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
