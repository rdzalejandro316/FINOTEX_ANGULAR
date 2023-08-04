import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultPqrsComponent } from './consult-pqrs.component';

describe('ConsultPqrsComponent', () => {
  let component: ConsultPqrsComponent;
  let fixture: ComponentFixture<ConsultPqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultPqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultPqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
