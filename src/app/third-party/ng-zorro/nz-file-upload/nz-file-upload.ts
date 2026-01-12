import { Component, OnInit, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { GlobalProperty } from 'src/app/core/global-property';

@Component({
  selector: 'app-nz-file-upload',
  template: `
   <div class="clearfix" nz-row style="height: 100px">
      <nz-upload #upload class="upload-list-inline"
        [nzAction]="uploadUrl"
        nzMultiple
        [nzListType]="'text'"
        [nzWithCredentials]="true"
        [nzData]="uploadParam"
        [nzHeaders]="fileUploadHeader"
        [nzFileList]="fileList()"
        (nzChange)="fileUploadChange($event)">
        <button nz-button>
          <span nz-icon nzType="upload"></span>
          <span>첨부파일</span>
        </button>
      </nz-upload>
  </div>
  `,
  styles: `
    :host ::ng-deep .upload-list-inline .ant-upload-list-item {
      float: left;
      width: 200px;
      margin-right: 8px;
    }
  `,
  imports: [NzUploadModule, NzButtonModule]
})
export class NzFileUpload implements OnInit {

  uploadParam = { pgmId: 'board', appUrl:'asd' };
  uploadUrl: string = GlobalProperty.serverUrl() + '/api/system/file';
  fileUploadHeader: any;

  /*{
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png'
    },

    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png'
    }*/
  fileList = input<NzUploadFile[]>([]);

  uploadCompleted = output<NzUploadFile[]>();

  ngOnInit() {
    this.fileUploadHeader = {
      Authorization: sessionStorage.getItem('token')
    }
  }

  fileUploadChange(params: NzUploadChangeParam): void {
    if (params.type === 'success') {
      // this.fileList = param.file.response;
      this.fileList().push(params.file.response[0]);
      this.uploadCompleted.emit(this.fileList());
    }
  }

}
