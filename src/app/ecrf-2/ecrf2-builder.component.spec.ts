import { TestBed } from '@angular/core/testing';
import { Ecrf2BuilderComponent } from './ecrf2-builder.component';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [Ecrf2BuilderComponent],
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Ecrf2BuilderComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(Ecrf2BuilderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain(
      'cdk-drag-and-drop-form app is running!',
    );
  });
});
