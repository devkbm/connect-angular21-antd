import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FileDropDirective } from './file-drop.directive';
import { FileSelectDirective } from './file-select.directive';

@NgModule({
  imports: [
    FileSelectDirective,
    FileDropDirective,
  ],
  exports: [
    FileSelectDirective,
    FileDropDirective,
  ],
})
export class FileUploadModule {
}
