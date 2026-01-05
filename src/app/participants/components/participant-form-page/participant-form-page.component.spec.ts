import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantFormPageComponent } from './participant-form-page.component';

describe('ParticipantFormPageComponent', () => {
  let component: ParticipantFormPageComponent;
  let fixture: ComponentFixture<ParticipantFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantFormPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
