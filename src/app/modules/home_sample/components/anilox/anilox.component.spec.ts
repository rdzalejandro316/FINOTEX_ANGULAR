import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AniloxComponent } from './anilox.component';

describe('AniloxComponent', () => {
  let component: AniloxComponent;
  let fixture: ComponentFixture<AniloxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AniloxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AniloxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
