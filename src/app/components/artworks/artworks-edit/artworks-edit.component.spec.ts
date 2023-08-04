import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworksEditComponent } from './artworks-edit.component';

describe('ArtworksEditComponent', () => {
  let component: ArtworksEditComponent;
  let fixture: ComponentFixture<ArtworksEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtworksEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworksEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
