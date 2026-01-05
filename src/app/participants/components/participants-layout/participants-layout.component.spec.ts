import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantsLayoutComponent } from './participants-layout.component';

describe('ParticipantsLayoutComponent', () => {
  let component: ParticipantsLayoutComponent;
  let fixture: ComponentFixture<ParticipantsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantsLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
