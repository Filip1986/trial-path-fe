import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantsDashboardComponent } from './participants-dashboard.component';

describe('ParticipantsDashboardComponent', () => {
  let component: ParticipantsDashboardComponent;
  let fixture: ComponentFixture<ParticipantsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantsDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
