import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrialPathHeaderComponent } from './trial-path-header.component';

describe('TrialPathHeaderComponent', () => {
  let component: TrialPathHeaderComponent;
  let fixture: ComponentFixture<TrialPathHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialPathHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrialPathHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
