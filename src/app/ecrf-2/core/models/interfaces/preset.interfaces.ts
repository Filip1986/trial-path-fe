import { OptionItem } from './options.interfaces';

/**
 * Standardized preset configuration interface
 */
export interface IPresetConfiguration {
  options?: OptionItem[];

  [key: string]: any;
}

/**
 * Interface for components that support presets
 */
export interface IPresetSupport {
  getConfigurationForPreset(): IPresetConfiguration;
  applyPresetConfiguration(config: IPresetConfiguration): void;
}
