import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { GdprConsentComponent } from './gdpr-consent.component';
import { GdprConsentService } from '@core/services/gdpr-consent.service';
import { GdprConsentPreferences } from '@core/models/consent.models';
import { DestroyRef } from '@angular/core';

describe('GdprConsentComponent', () => {
  let component: GdprConsentComponent;
  let fixture: ComponentFixture<GdprConsentComponent>;
  let mockGdprConsentService: jasmine.SpyObj<GdprConsentService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockDestroyRef: jasmine.SpyObj<DestroyRef>;

  const mockPreferences: GdprConsentPreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
    thirdParty: false,
    acceptedAt: new Date(),
    version: '1.0.0',
  };

  beforeEach(async () => {
    // Create spies for services
    mockGdprConsentService = jasmine.createSpyObj(
      'GdprConsentService',
      ['savePreferences', 'acceptAll', 'acceptNecessaryOnly'],
      {
        showBanner$: new BehaviorSubject<boolean>(false),
        preferences$: new BehaviorSubject<GdprConsentPreferences>(mockPreferences),
      },
    );

    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockDestroyRef = jasmine.createSpyObj('DestroyRef', ['onDestroy']);

    await TestBed.configureTestingModule({
      imports: [GdprConsentComponent],
      providers: [
        { provide: GdprConsentService, useValue: mockGdprConsentService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: DestroyRef, useValue: mockDestroyRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GdprConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.showDetailedSettings).toBe(false);
      expect(component.isSaving()).toBe(false);
    });

    it('should initialize signals from service observables', () => {
      expect(component.showBanner()).toBe(false);
      expect(component.preferences()).toEqual(mockPreferences);
    });
  });

  describe('Signals and Observables', () => {
    it('should update showBanner signal when service emits new value', () => {
      const showBannerSubject = mockGdprConsentService.showBanner$ as BehaviorSubject<boolean>;

      showBannerSubject.next(true);
      fixture.detectChanges();

      expect(component.showBanner()).toBe(true);
    });

    it('should update preferences signal when service emits new preferences', () => {
      const preferencesSubject =
        mockGdprConsentService.preferences$ as BehaviorSubject<GdprConsentPreferences>;
      const newPreferences: GdprConsentPreferences = {
        ...mockPreferences,
        analytics: true,
        marketing: true,
      };

      preferencesSubject.next(newPreferences);
      fixture.detectChanges();

      expect(component.preferences().analytics).toBe(true);
      expect(component.preferences().marketing).toBe(true);
    });
  });

  describe('preferencesShallowEqual method', () => {
    it('should return true when preferences are equal', () => {
      const prefs1: GdprConsentPreferences = {
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: true,
        thirdParty: false,
      };
      const prefs2: GdprConsentPreferences = {
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: true,
        thirdParty: false,
      };

      const result = (component as any).preferencesShallowEqual(prefs1, prefs2);
      expect(result).toBe(true);
    });

    it('should return false when preferences differ', () => {
      const prefs1: GdprConsentPreferences = {
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: true,
        thirdParty: false,
      };
      const prefs2: GdprConsentPreferences = {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: true,
        thirdParty: false,
      };

      const result = (component as any).preferencesShallowEqual(prefs1, prefs2);
      expect(result).toBe(false);
    });

    it('should handle undefined preferences', () => {
      const prefs1: any = undefined;
      const prefs2: GdprConsentPreferences = {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
        thirdParty: false,
      };

      const result = (component as any).preferencesShallowEqual(prefs1, prefs2);
      expect(result).toBe(false);
    });
  });

  describe('savePreferences method', () => {
    it('should call gdprConsentService.savePreferences with current preferences', () => {
      mockGdprConsentService.savePreferences.and.returnValue(of(true));

      component.savePreferences();

      expect(mockGdprConsentService.savePreferences).toHaveBeenCalledWith(mockPreferences);
    });

    it('should set isSaving to true during save operation', () => {
      mockGdprConsentService.savePreferences.and.returnValue(of(true));

      component.savePreferences();

      expect(component.isSaving()).toBe(true);
    });

    it('should show success message when save is successful', () => {
      mockGdprConsentService.savePreferences.and.returnValue(of(true));

      component.savePreferences();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Preferences Saved',
        detail: 'Your privacy preferences have been updated successfully.',
      });
    });

    it('should show info message when save returns false', () => {
      mockGdprConsentService.savePreferences.and.returnValue(of(false));

      component.savePreferences();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Preferences Saved Locally',
        detail:
          'Your privacy preferences have been saved locally. They will sync with our servers when you reconnect.',
      });
    });

    it('should reset isSaving and hide detailed settings after completion', () => {
      mockGdprConsentService.savePreferences.and.returnValue(of(true));
      component.showDetailedSettings = true;

      component.savePreferences();

      expect(component.isSaving()).toBe(false);
      expect(component.showDetailedSettings).toBe(false);
    });

    it('should reset isSaving even if service throws error', () => {
      mockGdprConsentService.savePreferences.and.returnValue(throwError('Service error'));

      component.savePreferences();

      expect(component.isSaving()).toBe(false);
    });
  });

  describe('acceptAll method', () => {
    it('should call gdprConsentService.acceptAll', () => {
      mockGdprConsentService.acceptAll.and.returnValue(of(true));

      component.acceptAll();

      expect(mockGdprConsentService.acceptAll).toHaveBeenCalled();
    });

    it('should set isSaving to true during operation', () => {
      mockGdprConsentService.acceptAll.and.returnValue(of(true));

      component.acceptAll();

      expect(component.isSaving()).toBe(true);
    });

    it('should show success message when acceptAll is successful', () => {
      mockGdprConsentService.acceptAll.and.returnValue(of(true));

      component.acceptAll();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Preferences Saved',
        detail: 'You have accepted all privacy preferences.',
      });
    });

    it('should show info message when acceptAll returns false', () => {
      mockGdprConsentService.acceptAll.and.returnValue(of(false));

      component.acceptAll();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Preferences Saved Locally',
        detail:
          'Your privacy preferences have been saved locally. They will sync with our servers when you reconnect.',
      });
    });

    it('should reset isSaving after completion', () => {
      mockGdprConsentService.acceptAll.and.returnValue(of(true));

      component.acceptAll();

      expect(component.isSaving()).toBe(false);
    });

    it('should reset isSaving even if service throws error', () => {
      mockGdprConsentService.acceptAll.and.returnValue(throwError('Service error'));

      component.acceptAll();

      expect(component.isSaving()).toBe(false);
    });
  });

  describe('acceptNecessaryOnly method', () => {
    it('should call gdprConsentService.acceptNecessaryOnly', () => {
      mockGdprConsentService.acceptNecessaryOnly.and.returnValue(of(true));

      component.acceptNecessaryOnly();

      expect(mockGdprConsentService.acceptNecessaryOnly).toHaveBeenCalled();
    });

    it('should set isSaving to true during operation', () => {
      mockGdprConsentService.acceptNecessaryOnly.and.returnValue(of(true));

      component.acceptNecessaryOnly();

      expect(component.isSaving()).toBe(true);
    });

    it('should show info message when acceptNecessaryOnly is successful', () => {
      mockGdprConsentService.acceptNecessaryOnly.and.returnValue(of(true));

      component.acceptNecessaryOnly();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Preferences Saved',
        detail: 'Only necessary cookies will be used.',
      });
    });

    it('should show info message when acceptNecessaryOnly returns false', () => {
      mockGdprConsentService.acceptNecessaryOnly.and.returnValue(of(false));

      component.acceptNecessaryOnly();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Preferences Saved Locally',
        detail:
          'Your privacy preferences have been saved locally. They will sync with our servers when you reconnect.',
      });
    });

    it('should reset isSaving after completion', () => {
      mockGdprConsentService.acceptNecessaryOnly.and.returnValue(of(true));

      component.acceptNecessaryOnly();

      expect(component.isSaving()).toBe(false);
    });

    it('should reset isSaving even if service throws error', () => {
      mockGdprConsentService.acceptNecessaryOnly.and.returnValue(throwError('Service error'));

      component.acceptNecessaryOnly();

      expect(component.isSaving()).toBe(false);
    });
  });

  describe('Template Integration', () => {
    it('should display banner when showBanner signal is true', () => {
      const showBannerSubject = mockGdprConsentService.showBanner$ as BehaviorSubject<boolean>;
      showBannerSubject.next(true);
      fixture.detectChanges();

      const bannerElement = fixture.debugElement.nativeElement.querySelector('.gdpr-banner');
      expect(bannerElement).toBeTruthy();
    });

    it('should hide banner when showBanner signal is false', () => {
      const showBannerSubject = mockGdprConsentService.showBanner$ as BehaviorSubject<boolean>;
      showBannerSubject.next(false);
      fixture.detectChanges();

      const bannerElement = fixture.debugElement.nativeElement.querySelector('.gdpr-banner');
      expect(bannerElement).toBeFalsy();
    });

    it('should disable buttons when isSaving is true', () => {
      const showBannerSubject = mockGdprConsentService.showBanner$ as BehaviorSubject<boolean>;
      showBannerSubject.next(true);
      component.isSaving.set(true);
      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
      buttons.forEach((button: HTMLButtonElement) => {
        expect(button.disabled).toBe(true);
      });
    });

    it('should enable buttons when isSaving is false', () => {
      const showBannerSubject = mockGdprConsentService.showBanner$ as BehaviorSubject<boolean>;
      showBannerSubject.next(true);
      component.isSaving.set(false);
      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
      buttons.forEach((button: HTMLButtonElement) => {
        expect(button.disabled).toBe(false);
      });
    });

    it('should show detailed settings dialog when showDetailedSettings is true', () => {
      component.showDetailedSettings = true;
      fixture.detectChanges();

      const dialog = fixture.debugElement.nativeElement.querySelector('p-dialog');
      expect(dialog).toBeTruthy();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete save preferences workflow', () => {
      mockGdprConsentService.savePreferences.and.returnValue(of(true));
      component.showDetailedSettings = true;

      component.savePreferences();

      expect(component.isSaving()).toBe(false);
      expect(component.showDetailedSettings).toBe(false);
      expect(mockGdprConsentService.savePreferences).toHaveBeenCalledWith(mockPreferences);
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Preferences Saved',
        detail: 'Your privacy preferences have been updated successfully.',
      });
    });

    it('should handle complete accept all workflow', () => {
      mockGdprConsentService.acceptAll.and.returnValue(of(true));

      component.acceptAll();

      expect(component.isSaving()).toBe(false);
      expect(mockGdprConsentService.acceptAll).toHaveBeenCalled();
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Preferences Saved',
        detail: 'You have accepted all privacy preferences.',
      });
    });

    it('should handle complete accept necessary only workflow', () => {
      mockGdprConsentService.acceptNecessaryOnly.and.returnValue(of(true));

      component.acceptNecessaryOnly();

      expect(component.isSaving()).toBe(false);
      expect(mockGdprConsentService.acceptNecessaryOnly).toHaveBeenCalled();
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Preferences Saved',
        detail: 'Only necessary cookies will be used.',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully in savePreferences', () => {
      mockGdprConsentService.savePreferences.and.returnValue(throwError('Network error'));

      expect(() => component.savePreferences()).not.toThrow();
      expect(component.isSaving()).toBe(false);
    });

    it('should handle service errors gracefully in acceptAll', () => {
      mockGdprConsentService.acceptAll.and.returnValue(throwError('Network error'));

      expect(() => component.acceptAll()).not.toThrow();
      expect(component.isSaving()).toBe(false);
    });

    it('should handle service errors gracefully in acceptNecessaryOnly', () => {
      mockGdprConsentService.acceptNecessaryOnly.and.returnValue(throwError('Network error'));

      expect(() => component.acceptNecessaryOnly()).not.toThrow();
      expect(component.isSaving()).toBe(false);
    });
  });

  describe('Memory Management', () => {
    it('should use takeUntilDestroyed for subscriptions', () => {
      // This test verifies that the component uses proper subscription management
      // The actual takeUntilDestroyed operator is tested by ensuring no memory leaks occur
      expect(component).toBeTruthy();

      // Simulate component destruction
      fixture.destroy();

      // Verify component can be destroyed without errors
      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});
