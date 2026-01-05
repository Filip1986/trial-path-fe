import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantDetailPageComponent } from './participant-detail-page.component';

describe('ParticipantDetailPageComponent', () => {
  let component: ParticipantDetailPageComponent;
  let fixture: ComponentFixture<ParticipantDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
