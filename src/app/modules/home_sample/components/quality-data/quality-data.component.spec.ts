import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityDataComponent } from './quality-data.component';

describe('QualityDataComponent', () => {
  let component: QualityDataComponent;
  let fixture: ComponentFixture<QualityDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
