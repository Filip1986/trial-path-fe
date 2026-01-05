import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCardExample2Component } from './article-card-example-2.component';

describe('ArticleCardExample2Component', () => {
  let component: ArticleCardExample2Component;
  let fixture: ComponentFixture<ArticleCardExample2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCardExample2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCardExample2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
