import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabErrorIndicatorComponent } from './tab-error-indicator.component';

describe('TabErrorIndicatorComponent', () => {
  let component: TabErrorIndicatorComponent;
  let fixture: ComponentFixture<TabErrorIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabErrorIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabErrorIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
