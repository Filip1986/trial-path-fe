import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WysiwygEditorExampleComponent } from './wysiwyg-editor-example.component';

describe('WysiwygEditorExampleComponent', () => {
  let component: WysiwygEditorExampleComponent;
  let fixture: ComponentFixture<WysiwygEditorExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygEditorExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WysiwygEditorExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
