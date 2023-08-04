import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSamplesComponent } from './home-samples.component';

describe('HomeSamplesComponent', () => {
  let component: HomeSamplesComponent;
  let fixture: ComponentFixture<HomeSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSamplesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
