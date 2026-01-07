import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { FormElementType } from '@core/models/enums/form.enums';

/**
 * Interface for a preset item
 */
export interface Preset {
  id: string;
  name: string;
  description?: string;
  type: FormElementType;
  configuration: any;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service for managing element configuration presets
 */
@Injectable({
  providedIn: 'root',
})
export class PresetService {
  private static readonly STORAGE_KEY = 'ecrf_element_presets';

  // BehaviorSubject to notify subscribers when presets change
  private presetsSubject: BehaviorSubject<Preset[]> = new BehaviorSubject<Preset[]>(
    this.loadPresets(),
  );

  // Observable for components to subscribe to
  public presets$: Observable<Preset[]> = this.presetsSubject.asObservable();

  constructor() {
    // Initialize with presets from storage
    this.loadPresets();
  }

  /**
   * Get all presets for a specific element type
   * @param type The form element type
   * @returns Presets for the specified type
   */
  getPresetsByType(type: FormElementType): Observable<Preset[]> {
    return new Observable<Preset[]>((observer: Subscriber<Preset[]>): void => {
      this.presets$.subscribe((presets: Preset[]): void => {
        const filteredPresets: Preset[] = presets.filter(
          (preset: Preset): boolean => preset.type === type,
        );
        observer.next(filteredPresets);
      });
    });
  }

  /**
   * Get a preset by its ID
   * @param id The preset ID
   * @returns The preset or undefined if not found
   */
  getPresetById(id: string): Preset | undefined {
    const presets: Preset[] = this.presetsSubject.value;
    return presets.find((preset: Preset): boolean => preset.id === id);
  }

  /**
   * Save a new preset
   * @param name Preset name
   * @param type Form element type
   * @param configuration The configuration to save
   * @param description Optional description
   * @returns The saved preset
   */
  savePreset(name: string, type: FormElementType, configuration: any, description = ''): Preset {
    const presets: Preset[] = this.presetsSubject.value;

    // Create a new preset
    const newPreset: Preset = {
      id: this.generateId(),
      name,
      description,
      type,
      configuration,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to a collection
    presets.push(newPreset);

    // Save to storage
    this.savePresets(presets);

    // Notify subscribers
    this.presetsSubject.next(presets);

    return newPreset;
  }

  /**
   * Update an existing preset
   * @param id Preset ID
   * @param updates Updates to apply
   * @returns The updated preset or undefined if not found
   */
  updatePreset(id: string, updates: Partial<Preset>): Preset | undefined {
    const presets: Preset[] = this.presetsSubject.value;
    const index: number = presets.findIndex((p: Preset): boolean => p.id === id);

    if (index !== -1) {
      // Update the preset
      presets[index] = {
        ...presets[index],
        ...updates,
        updatedAt: new Date(),
      };

      // Save to storage
      this.savePresets(presets);

      // Notify subscribers
      this.presetsSubject.next(presets);

      return presets[index];
    }

    return undefined;
  }

  /**
   * Delete a preset
   * @param id Preset ID to delete
   * @returns True if deleted, false if not found
   */
  deletePreset(id: string): boolean {
    const presets: Preset[] = this.presetsSubject.value;
    const index: number = presets.findIndex((p: Preset): boolean => p.id === id);

    if (index !== -1) {
      // Remove the preset
      presets.splice(index, 1);

      // Save to storage
      this.savePresets(presets);

      // Notify subscribers
      this.presetsSubject.next(presets);

      return true;
    }

    return false;
  }

  /**
   * Load presets from local storage
   * @returns Array of presets
   */
  private loadPresets(): Preset[] {
    try {
      const presetData: string | null = localStorage.getItem(PresetService.STORAGE_KEY);
      if (presetData) {
        // Parse dates properly when loading from JSON
        const presets: any = JSON.parse(presetData, (key: string, value: any): any => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
        return Array.isArray(presets) ? presets : [];
      }
    } catch (error) {
      console.error('Error loading presets:', error);
    }

    return [];
  }

  /**
   * Save presets to local storage
   * @param presets Array of presets to save
   */
  private savePresets(presets: Preset[]): void {
    try {
      localStorage.setItem(PresetService.STORAGE_KEY, JSON.stringify(presets));
    } catch (error) {
      console.error('Error saving presets:', error);
    }
  }

  /**
   * Generate a unique ID for a new preset
   * @returns Unique ID string
   */
  private generateId(): string {
    return Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }
}
