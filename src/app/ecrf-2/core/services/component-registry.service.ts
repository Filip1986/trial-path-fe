import { Injectable, Type } from '@angular/core';
import { ComponentType } from '../models/enums/component-types.enum';

@Injectable({ providedIn: 'root' })
export class ComponentRegistryService {
  private componentRegistry: Map<ComponentType, Type<any>> = new Map<ComponentType, Type<any>>();

  /**
   * Register a component type
   */
  registerComponent(typeName: ComponentType, component: Type<any>): void {
    this.componentRegistry.set(typeName, component);
  }

  /**
   * Get a component by type
   */
  getComponent(typeName: ComponentType): Type<any> | undefined {
    return this.componentRegistry.get(typeName);
  }
}
