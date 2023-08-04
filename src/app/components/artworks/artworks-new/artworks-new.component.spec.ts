import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworksNewComponent } from './artworks-new.component';

describe('ArtworksNewComponent', () => {
  let component: ArtworksNewComponent;
  let fixture: ComponentFixture<ArtworksNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtworksNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworksNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
