import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyMetricsComponent } from './study-metrics.component';

describe('StudyMetricsComponent', () => {
  let component: StudyMetricsComponent;
  let fixture: ComponentFixture<StudyMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyMetricsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudyMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
