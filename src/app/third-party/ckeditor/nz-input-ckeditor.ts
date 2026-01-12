import { Self, Optional, Component, HostBinding, viewChild, input, model } from '@angular/core';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';

import { CKEditorModule, CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, FileRepository } from 'ckeditor5';

//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
//import Editor from 'ckeditor5/build/ckeditor';

import { CkeditorUploadAdapter } from './ckeditor-upload-adapter';

// https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/angular.html
// https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/installing-plugins.html
// https://ckeditor.com/ckeditor-5/online-builder/

@Component({
  selector: 'nz-input-ckeditor',
  imports: [FormsModule, CKEditorModule],
  template: `
    <!-- tagName="textarea" -->
    <ckeditor #ckEditor
      [editor]="Editor"
      [config]="config"
      [disabled]="_disabled"
      [ngModel]="_value()"
      (change)="textChange($event)"
      (blur)="onTouched()"
      (ready)="onReady($event)">
    </ckeditor>
  `,
  styles: [`
    :host /*::ng-deep*/ .ck-editor__editable {
      color: black;
      height: var(--height);
    }
  `]
})
export class NzInputCkeditor implements ControlValueAccessor {

  ckEditor = viewChild.required(CKEditorComponent);

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');

  @HostBinding("style.--height")
  height = input<string>('100px');

  _disabled = false;
  _value = model();

  onChange!: (value: any) => void;
  onTouched!: () => void;

  public Editor = ClassicEditor;
  public config = {
    licenseKey: 'GPL',
    language: 'ko',
    plugins: [ FileRepository, Essentials, Paragraph, Bold, Italic ],
    toolbar: [
      'heading', '|',
      'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor', '|',
      'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
      'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify', '|',
      'bulletedList', 'numberedList', 'todoList', '|',
      '-', // break point
      /*
      'uploadImage', 'insertTable', '|',
      'outdent', 'indent', '|',
      'blockQuote', 'codeBlock', '|',
      'link', '|',
      'undo', 'redo'
      */
    ],
    image: {
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageTextAlternative'
      ]
    },
    extraPlugins: [
      function (editor: any) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader :any) => {
          return new CkeditorUploadAdapter(loader);
        };
      }
    ]
  }

  constructor(@Self()  @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  onReady(editor: any): void {
    //this.MyCustomUploadAdapterPlugin(editor);
    //editor.extraPlugins = [this.MyCustomUploadAdapterPlugin(editor)];
  }

  MyCustomUploadAdapterPlugin(editor: any ): any {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader: any ) => {
      return new CkeditorUploadAdapter( loader );
    }
  }

  logging(params: any) {
    console.log(params);
  }

  writeValue(obj: any): void {
    this._value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  //textChange( {editor}: ChangeEvent): void {
  textChange( {editor}: any): void {

    this._value.set(editor.getData());
    this.onChange(this._value());
  }

}
