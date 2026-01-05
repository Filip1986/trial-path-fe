import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudiesDashboardComponent } from './studies-dashboard.component';

describe('StudiesDashboardComponent', () => {
  let component: StudiesDashboardComponent;
  let fixture: ComponentFixture<StudiesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudiesDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudiesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
