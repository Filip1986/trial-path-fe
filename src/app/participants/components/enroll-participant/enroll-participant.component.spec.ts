import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollParticipantComponent } from './enroll-participant.component';

describe('EnrollParticipantComponent', () => {
  let component: EnrollParticipantComponent;
  let fixture: ComponentFixture<EnrollParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollParticipantComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
