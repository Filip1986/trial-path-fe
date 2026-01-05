import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueryManagementComponent } from './query-management.component';

describe('QueryManagementComponent', () => {
  let component: QueryManagementComponent;
  let fixture: ComponentFixture<QueryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QueryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
