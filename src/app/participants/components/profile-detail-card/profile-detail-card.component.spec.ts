import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileDetailCardComponent } from './profile-detail-card.component';

describe('ProfileDetailCardComponent', () => {
  let component: ProfileDetailCardComponent;
  let fixture: ComponentFixture<ProfileDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDetailCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
