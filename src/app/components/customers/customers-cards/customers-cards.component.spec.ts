import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersCardsComponent } from './customers-cards.component';

describe('CustomersCardsComponent', () => {
  let component: CustomersCardsComponent;
  let fixture: ComponentFixture<CustomersCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
