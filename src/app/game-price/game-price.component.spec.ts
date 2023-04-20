import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePriceComponent } from './game-price.component';

describe('GamePriceComponent', () => {
  let component: GamePriceComponent;
  let fixture: ComponentFixture<GamePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamePriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
