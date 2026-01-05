import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCardExampleComponent } from './article-card-example.component';

describe('ArticleCardExampleComponent', () => {
  let component: ArticleCardExampleComponent;
  let fixture: ComponentFixture<ArticleCardExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCardExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCardExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
