import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcrfBuilderComponent } from './ecrf-builder.component';

describe('EcrfBuilderComponent', () => {
  let component: EcrfBuilderComponent;
  let fixture: ComponentFixture<EcrfBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcrfBuilderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcrfBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
