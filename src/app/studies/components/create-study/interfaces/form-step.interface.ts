export interface IFormStep {
  id: string;
  label: string;
  fields: string[];
  isValid: boolean;
  isCompleted: boolean;
  component?: any; // Component class reference
}
