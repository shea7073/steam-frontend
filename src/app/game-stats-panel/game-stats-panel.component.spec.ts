import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatsPanelComponent } from './game-stats-panel.component';

describe('GameStatsPanelComponent', () => {
  let component: GameStatsPanelComponent;
  let fixture: ComponentFixture<GameStatsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameStatsPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameStatsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
