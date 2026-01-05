import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicLayoutBuilderComponent } from './dynamic-layout-builder.component';

describe('DynamicLayoutBuilderComponent', () => {
  let component: DynamicLayoutBuilderComponent;
  let fixture: ComponentFixture<DynamicLayoutBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicLayoutBuilderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicLayoutBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
