import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandProductsNewComponent } from './brand-products-new.component';

describe('BrandProductsNewComponent', () => {
  let component: BrandProductsNewComponent;
  let fixture: ComponentFixture<BrandProductsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandProductsNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandProductsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
