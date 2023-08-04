import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDataOfSampleComponent } from './general-data-of-sample.component';

describe('GeneralDataOfSampleComponent', () => {
  let component: GeneralDataOfSampleComponent;
  let fixture: ComponentFixture<GeneralDataOfSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDataOfSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDataOfSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
