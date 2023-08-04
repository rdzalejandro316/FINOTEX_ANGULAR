import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandProductsDetailComponent } from './brand-products-detail.component';

describe('BrandProductsDetailComponent', () => {
  let component: BrandProductsDetailComponent;
  let fixture: ComponentFixture<BrandProductsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandProductsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandProductsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
