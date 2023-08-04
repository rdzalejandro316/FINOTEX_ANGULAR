import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagmentPqrsComponent } from './managment-pqrs.component';

describe('ManagmentPqrsComponent', () => {
  let component: ManagmentPqrsComponent;
  let fixture: ComponentFixture<ManagmentPqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagmentPqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagmentPqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
