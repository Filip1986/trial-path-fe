import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteVisitsComponent } from './site-visits.component';

describe('SiteVisitsComponent', () => {
  let component: SiteVisitsComponent;
  let fixture: ComponentFixture<SiteVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteVisitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
