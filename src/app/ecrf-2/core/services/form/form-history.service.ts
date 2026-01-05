import { Injectable } from '@angular/core';

/**
 * Can be used with any type of state object
 */
@Injectable({ providedIn: 'root' })
export class HistoryService<T> {
  private history: T[] = [];
  private redoStack: T[] = [];
  private currentStateIndex = -1;

  /**
   * Initialize history with initial state
   * @param state The initial state
   */
  initializeHistory(state: T): void {
    this.resetHistory();
    const clonedState: T = this.deepClone(state);
    this.history = [clonedState];
    this.currentStateIndex = 0;
    console.log('History initialized with initial state');
  }

  /**
   * Reset the history
   */
  resetHistory(): void {
    this.history = [];
    this.redoStack = [];
    this.currentStateIndex = -1;
  }

  /**
   * Get the current history state for debugging
   */
  getDebugInfo(): {
    historySize: number;
    redoStackSize: number;
    currentIndex: number;
  } {
    return {
      historySize: this.history.length,
      redoStackSize: this.redoStack.length,
      currentIndex: this.currentStateIndex,
    };
  }

  /**
   * Deep clone an object to ensure immutability
   * @param obj The object to clone
   * @returns The cloned object
   */
  private deepClone<U>(obj: U): U {
    return JSON.parse(JSON.stringify(obj));
  }
}
