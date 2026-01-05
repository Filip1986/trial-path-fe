import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllParticipantsComponent } from './all-participants.component';

describe('AllParticipantsComponent', () => {
  let component: AllParticipantsComponent;
  let fixture: ComponentFixture<AllParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllParticipantsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
