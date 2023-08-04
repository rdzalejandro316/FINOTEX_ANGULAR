import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworksHistoryComponent } from './artworks-history.component';

describe('ArtworksHistoryComponent', () => {
  let component: ArtworksHistoryComponent;
  let fixture: ComponentFixture<ArtworksHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtworksHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworksHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
