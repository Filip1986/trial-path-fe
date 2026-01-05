export enum ConditionalOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
  IN_LIST = 'in_list',
  NOT_IN_LIST = 'not_in_list',
  MATCHES_PATTERN = 'matches_pattern',
  BETWEEN = 'between',
}

export enum ConditionalAction {
  SHOW = 'show',
  HIDE = 'hide',
  ENABLE = 'enable',
  DISABLE = 'disable',
  REQUIRE = 'require',
  UNREQUIRE = 'unrequire',
  SET_VALUE = 'set_value',
  CLEAR_VALUE = 'clear_value',
}

export interface ConditionalRule {
  id: string;
  name?: string; // User-friendly name for the rule
  description?: string; // Optional description

  // Source condition
  sourceControlId: string; // The control being watched
  sourceProperty?: string; // Which property to watch (value, checked, selectedOptions, etc.)
  operator: ConditionalOperator;
  value: any; // The value(s) to compare against

  // Target action
  targetControlIds: string[]; // Controls to apply action to (can affect multiple)
  action: ConditionalAction;
  actionValue?: any; // For SET_VALUE action

  // Advanced options
  enabled: boolean; // Rule can be temporarily disabled
  priority: number; // For rule execution order
  executeOnFormLoad: boolean; // Whether to evaluate when form loads

  // Grouping and logic
  groupId?: string; // For grouping related rules
  logicalOperator?: 'AND' | 'OR'; // For multiple conditions in a group
}

export interface ConditionalRuleGroup {
  id: string;
  name: string;
  description?: string;
  rules: ConditionalRule[];
  logicalOperator: 'AND' | 'OR'; // How to combine rules in this group
  enabled: boolean;
}

export interface ConditionalLogicConfig {
  rules: ConditionalRule[];
  groups: ConditionalRuleGroup[];
  globalEnabled: boolean; // Master switch for all conditional logic
}

// Evaluation context for rules
export interface RuleEvaluationContext {
  formData: Record<string, any>; // Current form values
  controlStates: Record<string, FormControlState>; // Current control states
  previousValues?: Record<string, any>; // Previous values for change detection
}

export interface FormControlState {
  visible: boolean;
  enabled: boolean;
  required: boolean;
  value: any;
  valid: boolean;
  errors?: string[];
}

// Rule evaluation result
export interface RuleEvaluationResult {
  ruleId: string;
  condition: boolean; // Whether the condition was met
  actions: ConditionalActionResult[];
  executionTime: number;
  error?: string;
}

export interface ConditionalActionResult {
  targetControlId: string;
  action: ConditionalAction;
  previousState: any;
  newState: any;
  applied: boolean;
  error?: string;
}

// For complex conditions
export interface ComplexCondition {
  type: 'simple' | 'group';
  operator?: ConditionalOperator;
  sourceControlId?: string;
  value?: any;
  conditions?: ComplexCondition[]; // For nested conditions
  logicalOperator?: 'AND' | 'OR';
}

// Rule templates for common medical scenarios
export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'medical' | 'demographic' | 'safety' | 'efficacy' | 'custom';
  template: Partial<ConditionalRule>;
  parameters: RuleTemplateParameter[];
}

export interface RuleTemplateParameter {
  name: string;
  type: 'control' | 'value' | 'operator' | 'action';
  required: boolean;
  defaultValue?: any;
  options?: any[];
}

// Event types for rule execution
export interface ConditionalLogicEvent {
  type: 'rule_evaluated' | 'action_applied' | 'error_occurred';
  ruleId: string;
  timestamp: Date;
  data: any;
}

// Export types for form control integration
export interface IFormControlWithConditionals {
  conditionalRules?: ConditionalRule[];
  conditionalState?: FormControlState;
  isConditionallyHidden?: boolean;
  isConditionallyDisabled?: boolean;
  isConditionallyRequired?: boolean;
}
