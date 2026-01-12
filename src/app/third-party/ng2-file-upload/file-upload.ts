import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

//import { FileUploader, FileUploadModule } from 'ng2-file-upload';

import { GlobalProperty } from 'src/app/core/global-property';
import { FileUploadModule } from './file-upload/file-upload.module';
import { FileUploader } from './file-upload/file-uploader.class';

export interface UploadedFile {
  uid: string;
  name: string;
  size: number;
	contentType: string;
  status: string;
  response: string;
  url: string;
}

@Component({
  selector: 'app-file-upload',
  imports: [
    CommonModule,
    FileUploadModule,
  ],
  template: `
<style>
  .my-drop-zone { border: dotted 3px lightgray; }
  .nv-file-over { border: dotted 3px red; } /* Default class applied to drop zones on over */
  .another-file-over-class { border: dotted 3px green; }

  html, body { height: 100%; }
</style>

<div class="container">
  <!--{{this.uploadedFileList() | json}}-->

  <div class="row">
    @if (isUploadBtnVisible()) {
      <div class="col-md-3">
        <label for="input-file" class="input-file-button">파일첨부</label>
        <input id="input-file" type="file" ng2FileSelect [uploader]="uploader" multiple style="display:none"/>
      </div>
    }

    <div class="col-md-9" style="margin-bottom: 40px">
      <p>파일 개수 : {{ uploader.queue.length + this.attachedFileList().length }}</p>

      <table class="table">
        <thead>
          <tr>
            <th width="80%">Name</th>
            <th width="20%">Size</th>
          </tr>
        </thead>

        <tbody>
          @for (file of this.attachedFileList(); track file.uid) {
          <tr>
            <td><a [href]="file.url" download> {{file.name}}</a></td>
            <td style="text-align: right">{{ file.size/1024/1024 | number:'.2' }} MB</td>
          </tr>
          }

          @for (item of uploader.queue; track item) {
          <tr>
            <td><strong>{{ item?.file?.name }}</strong></td>
            <td style="text-align: right">{{ item?.file?.size/1024/1024 | number:'.2' }} MB</td>
          </tr>
          }
        </tbody>
      </table>
    </div>

  </div>

</div>
  `,
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUpload {

  uploader: FileUploader = new FileUploader({
    url: GlobalProperty.serverUrl() + '/api/system/file',
    authToken: sessionStorage.getItem('token')!,
  });

  isUploadBtnVisible = input<boolean>(true);

  attachedFileList = input<UploadedFile[]>([]);

  uploadedFileList = model<UploadedFile[]>([]);
  uploadCompleted = output<UploadedFile[]>();

  constructor() {

    this.uploader.response.subscribe( (res: any) => {
      // 개별 파일로 업로드 처리되어 첫번째 response 데이터만 리스트에 추가
      //console.log(JSON.parse(res)[0]);
      this.uploadedFileList().push(JSON.parse(res)[0]);
    });

    this.uploader.onCompleteAll = () => {
      this.uploadCompleted.emit(this.uploadedFileList());
    };
  }

  upload() {
    this.uploader.uploadAll();
  }

  isUpload(): boolean {
    return this.uploader.queue.length > 0 ? true : false;
  }

}
