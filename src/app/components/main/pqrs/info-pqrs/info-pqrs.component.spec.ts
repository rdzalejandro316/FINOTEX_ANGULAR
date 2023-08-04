import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPqrsComponent } from './info-pqrs.component';

describe('InfoPqrsComponent', () => {
  let component: InfoPqrsComponent;
  let fixture: ComponentFixture<InfoPqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
