import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  ConditionalRule,
  ConditionalOperator,
  ConditionalAction,
  RuleEvaluationContext,
  RuleEvaluationResult,
  ConditionalActionResult,
  FormControlState,
  ConditionalLogicEvent,
  ConditionalLogicConfig,
} from '../models/conditional-logic.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ConditionalLogicService {
  private rules: ConditionalRule[] = [];
  private formData: Record<string, any> = {};
  private controlStates = new BehaviorSubject<Record<string, FormControlState>>({});
  // Public observables
  public controlStates$ = this.controlStates.asObservable();
  private evaluationResults = new BehaviorSubject<RuleEvaluationResult[]>([]);
  public evaluationResults$ = this.evaluationResults.asObservable();
  private events = new Subject<ConditionalLogicEvent>();
  public events$ = this.events.asObservable();

  private config: ConditionalLogicConfig = {
    rules: [],
    groups: [],
    globalEnabled: true,
  };

  /**
   * Initialize conditional logic with rules and initial form data
   */
  initialize(rules: ConditionalRule[], initialFormData: Record<string, any> = {}): void {
    console.log('Initializing conditional logic with', rules.length, 'rules');

    this.rules = [...rules].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    this.formData = { ...initialFormData };

    // Initialize control states
    this.initializeControlStates();

    // Evaluate rules that should run on form load
    this.evaluateRulesOnLoad();
  }

  /**
   * Update form data and trigger rule evaluation
   */
  updateFormData(controlId: string, value: any, triggerEvaluation = true): void {
    const previousValue = this.formData[controlId];
    this.formData[controlId] = value;

    console.log(`Form data updated: ${controlId} = ${value}`);

    if (triggerEvaluation && this.config.globalEnabled) {
      // Find rules that depend on this control
      const dependentRules = this.rules.filter(
        (rule) => rule.sourceControlId === controlId && rule.enabled,
      );

      if (dependentRules.length > 0) {
        this.evaluateRules(dependentRules, { [controlId]: previousValue });
      }
    }
  }

  /**
   * Add a new rule
   */
  addRule(rule: ConditionalRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => (a.priority || 0) - (b.priority || 0));

    if (rule.executeOnFormLoad) {
      this.evaluateRules([rule]);
    }
  }

  /**
   * Remove a rule
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter((rule) => rule.id !== ruleId);
  }

  /**
   * Update an existing rule
   */
  updateRule(updatedRule: ConditionalRule): void {
    const index = this.rules.findIndex((rule) => rule.id === updatedRule.id);
    if (index !== -1) {
      this.rules[index] = updatedRule;
      this.rules.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    }
  }

  /**
   * Get current state of a control
   */
  getControlState(controlId: string): FormControlState | undefined {
    return this.controlStates.value[controlId];
  }

  /**
   * Manually trigger evaluation of all rules
   */
  evaluateAllRules(): void {
    if (!this.config.globalEnabled) {
      console.log('Conditional logic is globally disabled');
      return;
    }

    this.evaluateRules(this.rules.filter((rule) => rule.enabled));
  }

  /**
   * Get rules that target a specific control
   */
  getRulesForTarget(controlId: string): ConditionalRule[] {
    return this.rules.filter((rule) => rule.targetControlIds.includes(controlId));
  }

  /**
   * Get rules that depend on a specific control
   */
  getRulesForSource(controlId: string): ConditionalRule[] {
    return this.rules.filter((rule) => rule.sourceControlId === controlId);
  }

  /**
   * Check for circular dependencies
   */
  checkForCircularDependencies(): string[] {
    const issues: string[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const detectCycle = (controlId: string, path: string[]): boolean => {
      if (recursionStack.has(controlId)) {
        issues.push(`Circular dependency detected: ${path.join(' → ')} → ${controlId}`);
        return true;
      }

      if (visited.has(controlId)) {
        return false;
      }

      visited.add(controlId);
      recursionStack.add(controlId);

      // Find all controls that this control affects
      const affectedControls = this.rules
        .filter((rule) => rule.sourceControlId === controlId)
        .flatMap((rule) => rule.targetControlIds);

      for (const affectedControl of affectedControls) {
        if (detectCycle(affectedControl, [...path, controlId])) {
          return true;
        }
      }

      recursionStack.delete(controlId);
      return false;
    };

    // Check all controls
    const allControls = new Set<string>();
    this.rules.forEach((rule) => {
      allControls.add(rule.sourceControlId);
      rule.targetControlIds.forEach((id) => allControls.add(id));
    });

    allControls.forEach((controlId) => {
      if (!visited.has(controlId)) {
        detectCycle(controlId, []);
      }
    });

    return issues;
  }

  /**
   * Enable/disable all conditional logic
   */
  setGlobalEnabled(enabled: boolean): void {
    this.config.globalEnabled = enabled;

    if (enabled) {
      this.evaluateAllRules();
    } else {
      // Reset all control states to default
      const currentStates = this.controlStates.value;
      Object.keys(currentStates).forEach((controlId) => {
        currentStates[controlId] = this.getDefaultControlState();
      });
      this.controlStates.next({ ...currentStates });
    }
  }

  /**
   * Get debugging information
   */
  getDebugInfo(): any {
    return {
      rulesCount: this.rules.length,
      enabledRulesCount: this.rules.filter((r) => r.enabled).length,
      controlStatesCount: Object.keys(this.controlStates.value).length,
      formDataKeys: Object.keys(this.formData),
      globalEnabled: this.config.globalEnabled,
      circularDependencies: this.checkForCircularDependencies(),
    };
  }

  /**
   * Evaluate specific rules
   */
  private evaluateRules(rules: ConditionalRule[], previousValues: Record<string, any> = {}): void {
    const context: RuleEvaluationContext = {
      formData: this.formData,
      controlStates: this.controlStates.value,
      previousValues,
    };

    const results: RuleEvaluationResult[] = [];

    for (const rule of rules) {
      try {
        const startTime = performance.now();
        const conditionMet = this.evaluateCondition(rule, context);
        const actions: ConditionalActionResult[] = [];

        if (conditionMet) {
          // Apply actions to all target controls
          for (const targetControlId of rule.targetControlIds) {
            const actionResult = this.applyAction(rule, targetControlId, context);
            actions.push(actionResult);

            if (actionResult.applied) {
              this.emitEvent({
                type: 'action_applied',
                ruleId: rule.id,
                timestamp: new Date(),
                data: actionResult,
              });
            }
          }
        }

        const executionTime = performance.now() - startTime;

        results.push({
          ruleId: rule.id,
          condition: conditionMet,
          actions,
          executionTime,
        });

        this.emitEvent({
          type: 'rule_evaluated',
          ruleId: rule.id,
          timestamp: new Date(),
          data: { conditionMet, executionTime },
        });
      } catch (error: any) {
        console.error(`Error evaluating rule ${rule.id}:`, error);

        results.push({
          ruleId: rule.id,
          condition: false,
          actions: [],
          executionTime: 0,
          error: error.message,
        });

        this.emitEvent({
          type: 'error_occurred',
          ruleId: rule.id,
          timestamp: new Date(),
          data: { error: error.message },
        });
      }
    }

    this.evaluationResults.next(results);
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(rule: ConditionalRule, context: RuleEvaluationContext): boolean {
    const sourceValue = this.getControlValue(rule.sourceControlId, rule.sourceProperty, context);

    return this.compareValues(sourceValue, rule.operator, rule.value);
  }

  /**
   * Compare values based on operator
   */
  private compareValues(
    sourceValue: any,
    operator: ConditionalOperator,
    targetValue: any,
  ): boolean {
    switch (operator) {
      case ConditionalOperator.EQUALS:
        return sourceValue === targetValue;

      case ConditionalOperator.NOT_EQUALS:
        return sourceValue !== targetValue;

      case ConditionalOperator.CONTAINS:
        if (Array.isArray(sourceValue)) {
          return sourceValue.includes(targetValue);
        }
        return String(sourceValue).toLowerCase().includes(String(targetValue).toLowerCase());

      case ConditionalOperator.NOT_CONTAINS:
        if (Array.isArray(sourceValue)) {
          return !sourceValue.includes(targetValue);
        }
        return !String(sourceValue).toLowerCase().includes(String(targetValue).toLowerCase());

      case ConditionalOperator.GREATER_THAN:
        return Number(sourceValue) > Number(targetValue);

      case ConditionalOperator.LESS_THAN:
        return Number(sourceValue) < Number(targetValue);

      case ConditionalOperator.GREATER_THAN_OR_EQUAL:
        return Number(sourceValue) >= Number(targetValue);

      case ConditionalOperator.LESS_THAN_OR_EQUAL:
        return Number(sourceValue) <= Number(targetValue);

      case ConditionalOperator.IS_EMPTY:
        return (
          sourceValue == null ||
          sourceValue === '' ||
          (Array.isArray(sourceValue) && sourceValue.length === 0)
        );

      case ConditionalOperator.IS_NOT_EMPTY:
        return (
          sourceValue != null &&
          sourceValue !== '' &&
          (!Array.isArray(sourceValue) || sourceValue.length > 0)
        );

      case ConditionalOperator.IN_LIST:
        return Array.isArray(targetValue) && targetValue.includes(sourceValue);

      case ConditionalOperator.NOT_IN_LIST:
        return !Array.isArray(targetValue) || !targetValue.includes(sourceValue);

      case ConditionalOperator.MATCHES_PATTERN:
        try {
          const regex = new RegExp(targetValue);
          return regex.test(String(sourceValue));
        } catch {
          return false;
        }

      case ConditionalOperator.BETWEEN:
        if (Array.isArray(targetValue) && targetValue.length === 2) {
          const numValue = Number(sourceValue);
          return numValue >= Number(targetValue[0]) && numValue <= Number(targetValue[1]);
        }
        return false;

      default:
        console.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * Apply an action to a target control
   */
  private applyAction(
    rule: ConditionalRule,
    targetControlId: string,
    context: RuleEvaluationContext,
  ): ConditionalActionResult {
    const currentState = context.controlStates[targetControlId] || this.getDefaultControlState();
    const previousState = { ...currentState };
    const newState = { ...currentState };
    let applied = false;

    try {
      switch (rule.action) {
        case ConditionalAction.SHOW:
          if (!newState.visible) {
            newState.visible = true;
            applied = true;
          }
          break;

        case ConditionalAction.HIDE:
          if (newState.visible) {
            newState.visible = false;
            newState.value = null; // Clear value when hiding
            applied = true;
          }
          break;

        case ConditionalAction.ENABLE:
          if (!newState.enabled) {
            newState.enabled = true;
            applied = true;
          }
          break;

        case ConditionalAction.DISABLE:
          if (newState.enabled) {
            newState.enabled = false;
            applied = true;
          }
          break;

        case ConditionalAction.REQUIRE:
          if (!newState.required) {
            newState.required = true;
            applied = true;
          }
          break;

        case ConditionalAction.UNREQUIRE:
          if (newState.required) {
            newState.required = false;
            applied = true;
          }
          break;

        case ConditionalAction.SET_VALUE:
          if (newState.value !== rule.actionValue) {
            newState.value = rule.actionValue;
            this.formData[targetControlId] = rule.actionValue;
            applied = true;
          }
          break;

        case ConditionalAction.CLEAR_VALUE:
          if (newState.value != null && newState.value !== '') {
            newState.value = null;
            this.formData[targetControlId] = null;
            applied = true;
          }
          break;
      }

      if (applied) {
        this.updateControlState(targetControlId, newState);
      }

      return {
        targetControlId,
        action: rule.action,
        previousState,
        newState,
        applied,
      };
    } catch (error: any) {
      return {
        targetControlId,
        action: rule.action,
        previousState,
        newState: previousState,
        applied: false,
        error: error.message,
      };
    }
  }

  /**
   * Get control value, optionally from a specific property
   */
  private getControlValue(
    controlId: string,
    property: string | undefined,
    context: RuleEvaluationContext,
  ): any {
    const formValue = context.formData[controlId];

    if (!property) {
      return formValue;
    }

    // Handle specific properties like 'checked', 'selectedOptions', etc.
    const controlState = context.controlStates[controlId];
    if (controlState && (controlState as any)[property] !== undefined) {
      return (controlState as any)[property];
    }

    return formValue;
  }

  /**
   * Initialize control states
   */
  private initializeControlStates(): void {
    // Get all unique control IDs from rules
    const controlIds = new Set<string>();

    this.rules.forEach((rule) => {
      controlIds.add(rule.sourceControlId);
      rule.targetControlIds.forEach((id) => controlIds.add(id));
    });

    // Initialize states for all controls
    const initialStates: Record<string, FormControlState> = {};
    controlIds.forEach((id) => {
      initialStates[id] = this.getDefaultControlState();
    });

    this.controlStates.next(initialStates);
  }

  /**
   * Get default control state
   */
  private getDefaultControlState(): FormControlState {
    return {
      visible: true,
      enabled: true,
      required: false,
      value: null,
      valid: true,
    };
  }

  /**
   * Update control state
   */
  private updateControlState(controlId: string, newState: FormControlState): void {
    const currentStates = this.controlStates.value;
    currentStates[controlId] = newState;
    this.controlStates.next({ ...currentStates });
  }

  /**
   * Evaluate rules that should run on form load
   */
  private evaluateRulesOnLoad(): void {
    const loadRules = this.rules.filter((rule) => rule.executeOnFormLoad && rule.enabled);

    if (loadRules.length > 0) {
      this.evaluateRules(loadRules);
    }
  }

  /**
   * Emit an event
   */
  private emitEvent(event: ConditionalLogicEvent): void {
    this.events.next(event);
  }
}
