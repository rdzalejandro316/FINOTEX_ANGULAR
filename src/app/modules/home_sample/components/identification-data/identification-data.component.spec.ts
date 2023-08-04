import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationDataComponent } from './identification-data.component';

describe('IdentificationDataComponent', () => {
  let component: IdentificationDataComponent;
  let fixture: ComponentFixture<IdentificationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentificationDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
