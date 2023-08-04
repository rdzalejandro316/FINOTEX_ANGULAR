import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTweaksComponent } from './inventory-tweaks.component';

describe('InventoryTweaksComponent', () => {
  let component: InventoryTweaksComponent;
  let fixture: ComponentFixture<InventoryTweaksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTweaksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTweaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
