import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionManagerComponent } from './options-manager.component';

describe('OptionManagerComponent', () => {
  let component: OptionManagerComponent;
  let fixture: ComponentFixture<OptionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
