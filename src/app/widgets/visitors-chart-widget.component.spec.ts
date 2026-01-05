import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitorsChartWidgetComponent } from './visitors-chart-widget.component';

describe('VisitorsChartWidgetComponent', () => {
  let component: VisitorsChartWidgetComponent;
  let fixture: ComponentFixture<VisitorsChartWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorsChartWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitorsChartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
