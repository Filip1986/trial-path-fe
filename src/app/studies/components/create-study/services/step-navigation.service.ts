import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStepNavigationService, IStepNavigation } from '../interfaces/step-navigation.interface';
import { IFormStep } from '../interfaces/form-step.interface';

@Injectable({
  providedIn: 'root',
})
export class StepNavigationService implements IStepNavigationService {
  private _currentStep = new BehaviorSubject<number>(0);
  private _formSteps = new BehaviorSubject<IFormStep[]>([]);

  currentStep$ = this._currentStep.asObservable();
  formSteps$ = this._formSteps.asObservable();

  get currentStep(): number {
    return this._currentStep.value;
  }

  get formSteps(): IFormStep[] {
    return this._formSteps.value;
  }

  // Navigation state as observable
  get navigationState$(): Observable<IStepNavigation> {
    return new Observable((observer) => {
      const subscription = this._currentStep.subscribe((currentStep) => {
        const formSteps = this._formSteps.value;
        observer.next({
          currentStep,
          totalSteps: formSteps.length,
          canGoNext: this.canProceedToNext(),
          canGoPrevious: this.canProceedToPrevious(),
          canSubmit: this.isLastStep() && this.allStepsValid(),
        });
      });
      return () => subscription.unsubscribe();
    });
  }

  initializeSteps(steps: IFormStep[]): void {
    this._formSteps.next(steps);
    this._currentStep.next(0);
  }

  updateStepValidation(stepId: string, isValid: boolean, isCompleted: boolean): void {
    const steps = [...this._formSteps.value];
    const stepIndex = steps.findIndex((step) => step.id === stepId);

    if (stepIndex !== -1) {
      steps[stepIndex] = {
        ...steps[stepIndex],
        isValid,
        isCompleted,
      };
      this._formSteps.next(steps);
    }
  }

  goToStep(stepIndex: number): void {
    const steps = this._formSteps.value;
    if (stepIndex >= 0 && stepIndex < steps.length) {
      this._currentStep.next(stepIndex);
    }
  }

  nextStep(): void {
    if (this.canProceedToNext()) {
      this._currentStep.next(this._currentStep.value + 1);
    }
  }

  previousStep(): void {
    if (this.canProceedToPrevious()) {
      this._currentStep.next(this._currentStep.value - 1);
    }
  }

  canProceedToNext(): boolean {
    const steps = this._formSteps.value;
    const currentStep = this._currentStep.value;

    if (currentStep >= steps.length - 1) return false;

    return steps[currentStep]?.isValid || false;
  }

  canProceedToPrevious(): boolean {
    return this._currentStep.value > 0;
  }

  isLastStep(): boolean {
    const steps = this._formSteps.value;
    return this._currentStep.value === steps.length - 1;
  }

  isFirstStep(): boolean {
    return this._currentStep.value === 0;
  }

  getCurrentStepData(): IFormStep | null {
    const steps = this._formSteps.value;
    const currentStep = this._currentStep.value;
    return steps[currentStep] || null;
  }

  getProgressPercentage(): number {
    const steps = this._formSteps.value;
    const completedSteps = steps.filter((step) => step.isCompleted).length;

    // Exclude review step from percentage calculation if it exists
    const stepsToCount =
      steps.length > 0 && steps[steps.length - 1].id === 'review' ? steps.length - 1 : steps.length;

    if (stepsToCount === 0) return 0;

    return Math.round((completedSteps / stepsToCount) * 100);
  }

  getAllStepsValid(): boolean {
    return this._formSteps.value.every((step) => step.isValid);
  }

  private allStepsValid(): boolean {
    return this._formSteps.value.every((step) => step.isValid);
  }

  reset(): void {
    this._currentStep.next(0);
    const resetSteps = this._formSteps.value.map((step) => ({
      ...step,
      isValid: false,
      isCompleted: false,
    }));
    this._formSteps.next(resetSteps);
  }
}
