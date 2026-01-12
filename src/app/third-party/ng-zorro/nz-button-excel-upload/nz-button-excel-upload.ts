import { Component, computed, effect, Input, input, OnInit, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule, NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { GlobalProperty } from 'src/app/core/global-property';

@Component({
  selector: 'app-nz-button-excel-upload',
  template: `
    <nz-upload
      [nzAction]="uploadUrl()"
      nzMultiple
      [nzListType]="'text'"
      [nzWithCredentials]="true"
      [nzData]="uploadParam"
      [nzHeaders]="fileUploadHeader"
      [nzFileList]="fileList()"
      [nzShowUploadList]="false"
      (nzChange)="fileUploadChange($event)">
      <button nz-button>
        <span nz-icon nzType="file-excel" nzTheme="outline"></span> UPLOAD
      </button>
    </nz-upload>
  `,
  styles: `
    :host {
      display : inline-block;
    }
  `,
  imports: [NzUploadModule, NzButtonModule, NzIconModule]
})
export class NzButtonExcelUpload implements OnInit {

  fileList = input<NzUploadFile[]>([]);
  urn = input<string>();
  //@Input() urn: string = '';

  uploadParam = { pgmId: 'board', appUrl:'asd' };
  //uploadUrl: string = GlobalProperty.serverUrl() + '/api/system/file';
  uploadUrl = computed(() => GlobalProperty.serverUrl() + this.urn()); //'/api/system/user-excel';

  fileUploadHeader: any;

  uploadCompleted = output<NzUploadFile[]>();

  constructor() {
    /*
    effect(() => {
      this.uploadUrl = GlobalProperty.serverUrl() + this.urn();
      console.log(this.uploadUrl);
    });
    */
  }

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

