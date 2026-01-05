import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSuspensionDialogComponent } from './user-suspension-dialog.component';

describe('UserSuspensionDialogComponent', () => {
  let component: UserSuspensionDialogComponent;
  let fixture: ComponentFixture<UserSuspensionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSuspensionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSuspensionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
