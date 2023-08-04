import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologsComponent } from './homologs.component';

describe('HomologsComponent', () => {
  let component: HomologsComponent;
  let fixture: ComponentFixture<HomologsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomologsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
