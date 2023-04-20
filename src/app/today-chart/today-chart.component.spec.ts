import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayChartComponent } from './today-chart.component';

describe('TodayChartComponent', () => {
  let component: TodayChartComponent;
  let fixture: ComponentFixture<TodayChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodayChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
