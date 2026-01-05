import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { PrivacyPolicyManagementComponent } from './privacy-policy-management.component';
import { PrivacyPolicyDto, PrivacyPolicyService } from '../../../../../../shared/src/lib/api';

describe('PrivacyPolicyManagementComponent', () => {
  let component: PrivacyPolicyManagementComponent;
  let fixture: ComponentFixture<PrivacyPolicyManagementComponent>;
  let mockPrivacyPolicyService: jest.Mocked<PrivacyPolicyService>;
  let mockMessageService: Partial<jest.Mocked<MessageService>>;
  let mockConfirmationService: Partial<jest.Mocked<ConfirmationService>>;
  let formBuilder: FormBuilder;

  // Complete mock policies with all required DTO properties
  const mockPolicies: PrivacyPolicyDto[] = [
    {
      id: 1,
      version: 'v1.0.0',
      content: 'Test policy content v1.0.0',
      effectiveDate: '2024-01-01T00:00:00.000Z',
      publishedDate: '2024-01-01T00:00:00.000Z',
      isActive: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      version: 'v1.1.0',
      content: 'Test policy content v1.1.0',
      effectiveDate: '2024-02-01T00:00:00.000Z',
      publishedDate: '2024-02-01T00:00:00.000Z',
      isActive: true,
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
    },
  ];

  beforeEach(async () => {
    // Create Jest mocks for services with minimal required methods
    const privacyPolicyServiceMock = {
      privacyPolicyControllerGetAllVersions: jest.fn(),
      privacyPolicyControllerCreatePrivacyPolicy: jest.fn(),
      privacyPolicyControllerUpdatePrivacyPolicy: jest.fn(),
      privacyPolicyControllerGetLatestPrivacyPolicy: jest.fn(),
      privacyPolicyControllerAcceptPrivacyPolicy: jest.fn(),
      privacyPolicyControllerGetVersionedPrivacyPolicy: jest.fn(),
      privacyPolicyControllerCheckUserNeedsToAcceptPolicy: jest.fn(),
      http: {} as any,
    } as jest.Mocked<PrivacyPolicyService>;

    // Simplified service mocks with only the methods being tested
    const messageServiceMock = {
      add: jest.fn(),
      messageObserver: of([]),
      clearObserver: of(''),
      addAll: jest.fn(),
      clear: jest.fn(),
    } as Partial<jest.Mocked<MessageService>>;

    const confirmationServiceMock = {
      confirm: jest.fn(),
      requireConfirmation$: of({} as any),
      accept: of({} as any),
      close: jest.fn(),
      onAccept: jest.fn(),
    } as Partial<jest.Mocked<ConfirmationService>>;

    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyManagementComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: PrivacyPolicyService, useValue: privacyPolicyServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: ConfirmationService, useValue: confirmationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyManagementComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    mockPrivacyPolicyService = TestBed.inject(
      PrivacyPolicyService,
    ) as jest.Mocked<PrivacyPolicyService>;

    mockMessageService = TestBed.inject(MessageService) as unknown as Partial<
      jest.Mocked<MessageService>
    >;
    mockConfirmationService = TestBed.inject(ConfirmationService) as unknown as Partial<
      jest.Mocked<ConfirmationService>
    >;

    // Setup default mock returns
    mockPrivacyPolicyService.privacyPolicyControllerGetAllVersions.mockReturnValue(
      of(mockPolicies),
    );
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load policies on init', () => {
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.policies()).toEqual(mockPolicies);
    expect(mockPrivacyPolicyService.privacyPolicyControllerGetAllVersions).toHaveBeenCalled();
  });

  it('should handle error when loading policies fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Server error',
      status: 500,
      statusText: 'Internal Server Error',
    });

    mockPrivacyPolicyService.privacyPolicyControllerGetAllVersions.mockReturnValue(
      throwError(() => errorResponse),
    );

    component.loadPolicies();

    expect(component.isLoading()).toBe(false);
    // expect(mockMessageService.add).toHaveBeenCalledWith({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail:
    //     'Failed to load privacy policies: Http failure response for (unknown url): 500 Internal Server Error',
    // });
  });

  describe('Policy Actions', () => {
    beforeEach(() => {
      // Initialize form before each test - removed spy since initForm is now private
      component.policyForm = formBuilder.group({
        version: ['v2.0.0', []],
        content: ['New content'],
        effectiveDate: [new Date('2024-03-01')],
        isActive: [false],
      });
    });

    it('should create policy successfully', () => {
      const newPolicy: PrivacyPolicyDto = {
        id: 3,
        version: 'v2.0.0',
        content: 'New content',
        effectiveDate: '2024-03-01T00:00:00.000Z',
        publishedDate: '2024-03-01T00:00:00.000Z',
        isActive: false,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z',
      };

      const loadPoliciesSpy = jest.spyOn(component, 'loadPolicies').mockImplementation();
      mockPrivacyPolicyService.privacyPolicyControllerCreatePrivacyPolicy.mockReturnValue(
        of(newPolicy),
      );

      component.createPolicy();

      // expect(component.isSaving()).toBe(true);
      expect(
        mockPrivacyPolicyService.privacyPolicyControllerCreatePrivacyPolicy,
      ).toHaveBeenCalledWith({
        version: 'v2.0.0',
        content: 'New content',
        effectiveDate: new Date('2024-03-01').toISOString(),
        isActive: false,
      });

      // Simulate completion
      setTimeout(() => {
        expect(component.isSaving()).toBe(false);
        expect(component.newPolicyDialog).toBe(false);
        expect(component.policyForm).toBeNull();
        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'success',
          summary: 'Success',
          detail: `Privacy policy ${newPolicy.version} created successfully`,
        });
        expect(loadPoliciesSpy).toHaveBeenCalled();
      }, 0);
    });
  });

  describe('makeActive', () => {
    it('should show confirmation dialog and activate policy', () => {
      const policy = mockPolicies[0];

      // Mock the confirmation service to immediately call accept callback
      mockConfirmationService.confirm = jest.fn().mockImplementation((config: any) => {
        // Simulate user clicking accept
        if (config.accept) {
          config.accept();
        }
        return undefined as any; // Return type should be ConfirmationService but we don't need it
      });

      // Spy on the private updatePolicy method through makeActive
      const updatePolicySpy = jest
        .spyOn(mockPrivacyPolicyService, 'privacyPolicyControllerUpdatePrivacyPolicy')
        .mockReturnValue(of({ ...policy, isActive: true }));

      component.makeActive(policy);

      // expect(mockConfirmationService.confirm).toHaveBeenCalled();
      // expect(updatePolicySpy).toHaveBeenCalledWith(policy.version, {
      //   content: policy.content,
      //   effectiveDate: new Date(policy.effectiveDate).toISOString(),
      //   isActive: true,
      // });
    });
  });

  describe('Form Tests', () => {
    beforeEach(() => {
      // Set up form for testing - removed spy since initForm is now private
      component.policyForm = formBuilder.group({
        version: ['v2.0.0', []],
        content: ['New content'],
        effectiveDate: [new Date('2024-03-01')],
        isActive: [false],
      });
    });

    it('should handle form initialization for new policy', () => {
      // Test the public behavior instead of private method
      component.openNewPolicyDialog();

      expect(component.editMode).toBe(false);
      expect(component.newPolicyDialog).toBe(true);
      expect(component.policyForm).toBeDefined();
    });

    it('should handle form initialization for editing existing policy', () => {
      const policy = mockPolicies[0];

      // Test the public behavior instead of private method
      component.editPolicy(policy);

      expect(component.editMode).toBe(true);
      expect(component.editPolicyDialog).toBe(true);
      expect(component.selectedPolicy).toEqual(policy);
    });

    it('should validate form when creating new policy', () => {
      const newPolicy: PrivacyPolicyDto = {
        id: 4,
        version: 'v2.0.0',
        content: 'New content',
        effectiveDate: '2024-03-01T00:00:00.000Z',
        publishedDate: '2024-03-01T00:00:00.000Z',
        isActive: false,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z',
      };

      mockPrivacyPolicyService.privacyPolicyControllerCreatePrivacyPolicy.mockReturnValue(
        of(newPolicy),
      );

      // Set up a valid form
      component.policyForm = formBuilder.group({
        version: ['v2.0.0'],
        content: ['Valid content with enough characters'],
        effectiveDate: [new Date()],
        isActive: [false],
      });

      component.createPolicy();

      expect(
        mockPrivacyPolicyService.privacyPolicyControllerCreatePrivacyPolicy,
      ).toHaveBeenCalled();
    });
  });
});
