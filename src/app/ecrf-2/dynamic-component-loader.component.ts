import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Type,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRegistryService } from './core/services/component-registry.service';
import { DragDropService } from './core/services/drag-and-drop';
import { Subscription } from 'rxjs';
import { ComponentType } from './core/models/enums/component-types.enum';

interface ComponentTypeMapping {
  [key: string]: ComponentType | undefined;
}

/**
 * Component that dynamically loads other components based on a type name
 * This helps avoid circular dependencies by using the component registry
 */
@Component({
  selector: 'app-dynamic-component',
  template: `
    @if (componentType) {
      <ng-container
        [ngComponentOutlet]="componentType"
        [ngComponentOutletInputs]="inputBindings"
        />
    }
    `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DynamicComponentLoaderComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * The name of the component to load from the registry
   */
  @Input() componentName: ComponentType | string = '';

  /**
   * The inputs to pass to the loaded component
   */
  @Input() inputs: Record<string, any> = {};

  /**
   * The resolved component type
   */
  componentType: Type<any> | null = null;

  /**
   * The input bindings for the component outlet
   */
  inputBindings: Record<string, any> = {};

  // Subscription for change detection triggers
  private subscription: Subscription = new Subscription();

  constructor(
    private componentRegistry: ComponentRegistryService,
    private dragDropService: DragDropService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Subscribe to change detection triggers
    this.subscription.add(
      this.dragDropService.changeDetectionNeeded$.subscribe((): void => {
        this.cdr.markForCheck();
      }),
    );

    // Also subscribe to control dropped events
    this.subscription.add(
      this.dragDropService.controlDropped.subscribe((): void => {
        this.cdr.markForCheck();
      }),
    );
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When the component name changes, look up the component type
    if (changes['componentName']) {
      this.loadComponent();
    }

    // When inputs change, update the bindings
    if (changes['inputs']) {
      this.inputBindings = { ...this.inputs };
      // Force change detection when inputs change
      this.cdr.markForCheck();
    }
  }

  /**
   * Load the component from the registry
   */
  private loadComponent(): void {
    if (!this.componentName) {
      console.warn('No component name provided to dynamic component loader');
      return;
    }

    // Check if componentName is a string and convert it to ComponentType enum
    let componentType: ComponentType;

    if (typeof this.componentName === 'string') {
      const componentTypeMap: ComponentTypeMapping = Object.entries(ComponentType).reduce(
        (acc, [_, value]) => ({
          ...acc,
          [value]: value as ComponentType,
        }),
        {},
      );

      // Try to convert string to enum
      const enumValue: ComponentType | undefined = componentTypeMap[this.componentName];

      if (!enumValue) {
        console.error(
          `Component with name "${this.componentName}" not found in ComponentType enum`,
        );
        this.componentType = null;
        return;
      }

      componentType = enumValue as ComponentType;
    } else {
      // It's already a ComponentType enum value
      componentType = this.componentName;
    }

    // Get the component from the registry
    const component: Type<any> | undefined = this.componentRegistry.getComponent(componentType);

    if (!component) {
      console.error(`Component with type "${componentType}" not found in registry`);
      this.componentType = null;
    } else {
      this.componentType = component;
      // Force change detection after a component is loaded
      this.cdr.markForCheck();
    }
  }
}
