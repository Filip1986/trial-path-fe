import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProtocolDeviationsComponent } from './protocol-deviations.component';

describe('ProtocolDeviationsComponent', () => {
  let component: ProtocolDeviationsComponent;
  let fixture: ComponentFixture<ProtocolDeviationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolDeviationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProtocolDeviationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
