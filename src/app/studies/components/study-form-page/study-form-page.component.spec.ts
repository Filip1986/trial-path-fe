import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyFormPageComponent } from './study-form-page.component';

describe('StudyFormPageComponent', () => {
  let component: StudyFormPageComponent;
  let fixture: ComponentFixture<StudyFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyFormPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudyFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
