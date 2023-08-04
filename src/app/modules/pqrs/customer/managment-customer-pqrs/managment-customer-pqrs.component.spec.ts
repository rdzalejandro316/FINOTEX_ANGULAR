import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagmentCustomerPqrsComponent } from './managment-customer-pqrs.component';

describe('ManagmentCustomerPqrsComponent', () => {
  let component: ManagmentCustomerPqrsComponent;
  let fixture: ComponentFixture<ManagmentCustomerPqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagmentCustomerPqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagmentCustomerPqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
