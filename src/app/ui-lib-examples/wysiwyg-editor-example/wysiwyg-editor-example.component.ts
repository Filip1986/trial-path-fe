import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import {
  EditorSelectionComponent,
  EditorType,
  EditorOptions,
  BaseEditor,
} from '@artificial-sense/ui-lib';

@Component({
  selector: 'app-wysiwyg-editor-example',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    ToastModule,
    CheckboxModule,
    InputTextModule,
    EditorSelectionComponent
],
  templateUrl: './wysiwyg-editor-example.component.html',
  styleUrl: './wysiwyg-editor-example.component.scss',
})
export class WysiwygEditorExampleComponent implements OnInit {
  // Initial content
  editorContent =
    '<h1>Welcome to the WYSIWYG Editor Demo</h1><p>This is a <strong>rich text editor</strong> implementation using our ui-lib components.</p><p>Try out different editors and features!</p>';

  // Editor options
  editorOptions: EditorOptions = {
    placeholder: 'Start typing something amazing...',
    readonly: false,
    minHeight: '300px',
  };

  // Currently selected editor type
  selectedEditorType = EditorType.TIPTAP;

  // For displaying output
  outputContent = '';

  // Current editor instance
  currentEditor: BaseEditor | null = null;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Initialize output content
    this.outputContent = this.editorContent;
  }

  /**
   * Handle editor type change
   */
  onEditorTypeChange(editorType: EditorType): void {
    this.selectedEditorType = editorType;
    this.messageService.add({
      severity: 'info',
      summary: 'Editor Changed',
      detail: `Now using ${this.getEditorTypeName(editorType)} editor`,
    });
  }

  /**
   * Get editor type name for display
   */
  getEditorTypeName(type: EditorType): string {
    switch (type) {
      case EditorType.TIPTAP:
        return 'TipTap';
      case EditorType.QUILL:
        return 'Quill';
      case EditorType.CKEDITOR:
        return 'CKEditor';
      case EditorType.TINYMCE:
        return 'TinyMCE';
      default:
        return 'Unknown';
    }
  }

  /**
   * Handle editor ready event
   */
  onEditorReady(editor: BaseEditor): void {
    this.currentEditor = editor;
    this.messageService.add({
      severity: 'success',
      summary: 'Editor Ready',
      detail: `${this.getEditorTypeName(this.selectedEditorType)} editor initialized`,
    });
  }

  /**
   * Handle content change from editor
   */
  onContentChange(content: string): void {
    this.editorContent = content;
    this.outputContent = content;
  }

  /**
   * Toggle editor readonly state
   */
  toggleReadOnly(readonly: CheckboxChangeEvent): void {
    const isReadOnly = readonly.checked;

    this.editorOptions = {
      ...this.editorOptions,
      readonly: isReadOnly,
    };

    // Apply to current editor if available
    if (this.currentEditor) {
      if (isReadOnly) {
        this.currentEditor.disable();
      } else {
        this.currentEditor.enable();
      }
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Editor Mode Changed',
      detail: isReadOnly
        ? 'Editor is now in read-only mode'
        : 'Editor is now in edit mode',
    });
  }

  /**
   * Insert a sample image into the editor
   */
  insertSampleImage(): void {
    if (!this.currentEditor) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Editor not ready',
      });
      return;
    }

    // Different editors have different ways to insert images, so we use a basic approach
    // In a real app, you'd have a more sophisticated image insertion process
    const imageUrl = 'https://placekitten.com/400/300';

    // For TipTap editor, which we know has this method
    if (this.selectedEditorType === EditorType.TIPTAP) {
      (this.currentEditor as any).formatText('image', { src: imageUrl });
    } else {
      // For other editors, we'll add HTML directly
      const currentContent = this.currentEditor.getContent();
      const newContent =
        currentContent + `<p><img src="${imageUrl}" alt="Sample image"></p>`;
      this.currentEditor.setContent(newContent);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Image Inserted',
      detail: 'Sample image added to editor',
    });
  }

  /**
   * Clear the editor content
   */
  clearEditor(): void {
    if (this.currentEditor) {
      this.currentEditor.clear();
      this.outputContent = '';

      this.messageService.add({
        severity: 'info',
        summary: 'Editor Cleared',
        detail: 'All content has been cleared',
      });
    }
  }

  /**
   * Reset editor to initial content
   */
  resetContent(): void {
    const initialContent =
      '<h1>Welcome to the WYSIWYG Editor Demo</h1><p>This is a <strong>rich text editor</strong> implementation using our ui-lib components.</p><p>Try out different editors and features!</p>';

    if (this.currentEditor) {
      this.currentEditor.setContent(initialContent);
      this.editorContent = initialContent;
      this.outputContent = initialContent;

      this.messageService.add({
        severity: 'info',
        summary: 'Content Reset',
        detail: 'Editor content has been reset to default',
      });
    }
  }
}
