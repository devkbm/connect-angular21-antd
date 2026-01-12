import { Component, input } from '@angular/core';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-nz-file-download',
  template: `
    <div class="container" [style.height]="this.height()">
      <nz-upload #upload class="upload-list-inline"
        nzMultiple
        [nzListType]="'picture'"
        [nzWithCredentials]="true"
        [nzFileList]="fileList()">
      </nz-upload>
    </div>
  `,
  styles: `
    :host ::ng-deep .upload-list-inline .ant-upload-list-item {
      float: left;
      padding-top: 0px;
      margin-top: 0px;
      /*margin-right: 8px;*/
    }

    .container {
      display: block;
      overflow: auto;
      border: 1px solid;
    }
  `,
  imports: [NzUploadModule]
})
export class NzFileDownload {
  height = input<string>('100%');
  fileList = input<NzUploadFile[]>([]);

}
