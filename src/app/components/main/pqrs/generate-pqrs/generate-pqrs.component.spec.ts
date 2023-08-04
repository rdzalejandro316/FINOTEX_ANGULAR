import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePqrsComponent } from './generate-pqrs.component';

describe('GeneratePqrsComponent', () => {
  let component: GeneratePqrsComponent;
  let fixture: ComponentFixture<GeneratePqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratePqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
