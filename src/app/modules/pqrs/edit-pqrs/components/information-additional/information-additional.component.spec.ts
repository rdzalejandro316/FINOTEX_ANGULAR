import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationAdditionalComponent } from './information-additional.component';

describe('InformationAdditionalComponent', () => {
  let component: InformationAdditionalComponent;
  let fixture: ComponentFixture<InformationAdditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationAdditionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
