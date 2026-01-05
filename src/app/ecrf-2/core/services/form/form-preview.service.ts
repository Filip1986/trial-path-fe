import {
  Injectable,
  ApplicationRef,
  EnvironmentInjector,
  createComponent,
  ComponentRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PreviewDialogComponent } from '../../../dialogs/shared/components/preview-dialog/preview-dialog.component';
import { IForm } from '../../models/interfaces/form.interfaces';

/**
 * Service to handle form preview functionality
 */
@Injectable({
  providedIn: 'root',
})
export class PreviewService {
  private previewDialogRef: ComponentRef<PreviewDialogComponent> | null = null;

  constructor(
    private injector: EnvironmentInjector,
    private appRef: ApplicationRef,
  ) {}

  /**
   * Opens a dialog to preview the form
   *
   * @param form The form to preview
   */
  previewForm(form: IForm): void {
    // Clean up any existing dialog
    this.removePreviewDialog();

    // Create the component
    this.previewDialogRef = createComponent(PreviewDialogComponent, {
      environmentInjector: this.injector,
    });

    // Set the form input
    this.previewDialogRef.instance.form = form;

    // Subscribe to visibleChange to handle the dialog closing
    const visibleSub: Subscription = this.previewDialogRef.instance.visibleChange.subscribe(
      (visible: boolean): void => {
        if (!visible) {
          // Clean up when the dialog is closed
          this.removePreviewDialog();
          visibleSub.unsubscribe();
        }
      },
    );

    // Attach to the app and DOM
    this.appRef.attachView(this.previewDialogRef.hostView);
    const domElement: any = this.previewDialogRef.location.nativeElement;
    document.body.appendChild(domElement);

    // Make the dialog visible
    this.previewDialogRef.instance.visible = true;
  }

  /**
   * Remove the preview dialog from DOM and destroy the component
   */
  private removePreviewDialog(): void {
    if (this.previewDialogRef) {
      this.appRef.detachView(this.previewDialogRef.hostView);
      this.previewDialogRef.location.nativeElement.remove();
      this.previewDialogRef.destroy();
      this.previewDialogRef = null;
    }
  }
}
