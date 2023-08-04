import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworksDetailsComponent } from './artworks-details.component';

describe('ArtworksDetailsComponent', () => {
  let component: ArtworksDetailsComponent;
  let fixture: ComponentFixture<ArtworksDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtworksDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworksDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
