import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudiesLayoutComponent } from './studies-layout.component';

describe('StudiesLayoutComponent', () => {
  let component: StudiesLayoutComponent;
  let fixture: ComponentFixture<StudiesLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudiesLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudiesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
