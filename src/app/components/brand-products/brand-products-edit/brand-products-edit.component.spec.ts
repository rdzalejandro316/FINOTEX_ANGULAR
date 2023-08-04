import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandProductsEditComponent } from './brand-products-edit.component';

describe('BrandProductsEditComponent', () => {
  let component: BrandProductsEditComponent;
  let fixture: ComponentFixture<BrandProductsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandProductsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandProductsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
