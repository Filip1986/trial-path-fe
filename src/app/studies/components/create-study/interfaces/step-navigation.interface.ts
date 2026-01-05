import { IFormStep } from './form-step.interface';

export interface IStepNavigation {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  canSubmit: boolean;
}

export interface IStepNavigationService {
  currentStep: number;
  formSteps: IFormStep[];

  goToStep(stepIndex: number): void;
  nextStep(): void;
  previousStep(): void;
  canProceedToNext(): boolean;
  canProceedToPrevious(): boolean;
  isLastStep(): boolean;
  getProgressPercentage(): number;
}
