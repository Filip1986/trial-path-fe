import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetaProgramWidgetComponent } from './beta-program-widget.component';

describe('BetaProgramWidgetComponent', () => {
  let component: BetaProgramWidgetComponent;
  let fixture: ComponentFixture<BetaProgramWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetaProgramWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BetaProgramWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
