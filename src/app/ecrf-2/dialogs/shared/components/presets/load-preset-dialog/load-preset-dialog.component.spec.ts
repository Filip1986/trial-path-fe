import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadPresetDialogComponent } from './load-preset-dialog.component';

describe('LoadPresetDialogComponent', () => {
  let component: LoadPresetDialogComponent;
  let fixture: ComponentFixture<LoadPresetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadPresetDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadPresetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
