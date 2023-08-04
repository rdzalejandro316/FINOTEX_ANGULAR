import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandProductsListComponent } from './brand-products-list.component';

describe('BrandProductsListComponent', () => {
  let component: BrandProductsListComponent;
  let fixture: ComponentFixture<BrandProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandProductsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
