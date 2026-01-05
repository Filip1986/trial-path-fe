import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibBreadcrumbExampleComponent } from './lib-breadcrumb-example.component';

describe('LibBreadcrumbExampleComponent', () => {
  let component: LibBreadcrumbExampleComponent;
  let fixture: ComponentFixture<LibBreadcrumbExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibBreadcrumbExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibBreadcrumbExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
