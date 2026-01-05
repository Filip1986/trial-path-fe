import { IForm } from '../interfaces/form.interfaces';

export type FormMetadataFields =
  | 'title'
  | 'description'
  | 'status'
  | 'version'
  | 'createdAt'
  | 'updatedAt';
export type FormMetadataUpdates = Partial<Pick<IForm, FormMetadataFields>>;
