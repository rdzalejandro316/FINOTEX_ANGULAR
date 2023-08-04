import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPqrsComponent } from './edit-pqrs.component';

describe('EditPqrsComponent', () => {
  let component: EditPqrsComponent;
  let fixture: ComponentFixture<EditPqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
