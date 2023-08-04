import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuchaseOrderComponent } from './puchase-order.component';

describe('PuchaseOrderComponent', () => {
  let component: PuchaseOrderComponent;
  let fixture: ComponentFixture<PuchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
