import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GsapShowcaseComponent } from './gsap-showcase.component';

describe('GsapShowcaseComponent', () => {
  let component: GsapShowcaseComponent;
  let fixture: ComponentFixture<GsapShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GsapShowcaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GsapShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
