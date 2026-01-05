import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSettingsComponent } from './behavior-settings.component';

describe('BehaviorSettingsComponent', () => {
  let component: BehaviorSettingsComponent;
  let fixture: ComponentFixture<BehaviorSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BehaviorSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BehaviorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
