import { Component, OnInit, OnChanges, SimpleChanges, inject, input, model, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { GlobalProperty } from 'src/app/core/global-property';

import { saveAs } from 'file-saver';

import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'user-image-upload',
  imports: [
    CommonModule,
    NzButtonModule,
    NzUploadModule,
    NzAvatarModule,
    NzIconModule,
    NzSpaceModule
  ],
  template: `
  <div class="container">
    <nz-avatar class="avatar" nzShape="square" [nzSize]="96" [nzSrc]="getImageSrc()" nzIcon="user">
    </nz-avatar>
    <nz-space [nzAlign]="'center'">
      <nz-upload
          [nzAction]="upload.url"
          [nzShowUploadList]="false"
          [nzPreview]="handlePreview"
          [nzRemove]="handleRemove"
          [nzWithCredentials]="true"
          [nzData]="upload.data"
          [nzHeaders]="upload.headers"
          [nzFileList]="fileList"
          (nzChange)="fileUploadChange($event)">
          <button nz-button class="upload-button">
            <span nz-icon nzType="upload" class="button-icon"></span>
          </button>
      </nz-upload>
      <button nz-button class="download-button" (click)="downloadImage()">
        <span nz-icon nzType="download" class="button-icon"></span>
      </button>
    </nz-space>
  </div>


  `,
  styles: [`
    .container {
      text-align: center;
      height: 96px;
      background-color: green;
    }

    .avatar {
    }

    .upload-button {
      width: 24px;
      height: 24px;
      background-color: darkslategray;

      position: absolute;
      float: right;
      right: 26px;
      bottom: 0px;
    }

    .download-button {
      width: 24px;
      height: 24px;
      background-color: darkslategray;

      position: absolute;
      float: right;
      right: 0px;
      bottom: 0px;
    }

    .button-icon {
      /*
      position: absolute;
      margin-left: -6px;
      margin-top: -6px;
      */
    }
  `]
})
export class UserImageUpload implements OnInit, OnChanges {

  upload: {url: string, headers: any, data: any} = {
    url: GlobalProperty.serverUrl() + '/api/system/user/image',
    headers: { Authorization: sessionStorage.getItem('token') },
    data: null
  }

  previewImage: string | undefined = '';

  imageSrc: string = GlobalProperty.serverUrl() + '/api/system/user/image'; //'/static/';


  private sanitizer = inject(DomSanitizer);

  /*
  @Input() imageWidth: string = '150px';
  @Input() imageHeight: string = '200px';
  @Input() pictureFileId: any;
  @Input() userId: string = '';
  */
  imageWidth = input<string>('150px');
  imageHeight = input<string>('200px');

  userId = input.required<string>();
  pictureFileId = model<any>();

  /*{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }*/
  fileList: NzUploadFile[] = [];

  private http = inject(HttpClient);

  constructor() {
    effect(() => {
      if (this.userId()) {
        this.upload.data = {companyCode: sessionStorage.getItem('companyCode'),  userId: this.userId()};
      }

      if (this.pictureFileId()) {
        this.getImageSrc();
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    /*
    if (changes['userId'].currentValue && changes['userId'].currentValue !== null && changes['userId'].currentValue !== undefined) {
      // console.log(changes['userId'].currentValue);
      this.upload.data = {companyCode: sessionStorage.getItem('companyCode'),  userId: changes['userId'].currentValue};
    }
      */
  }


  ngOnInit(): void {
  }

  // 미리보기 버튼 클릭시
  handlePreview = (file: NzUploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
  }

  // 삭제버튼 클릭스
  handleRemove = (file: NzUploadFile) => {
    console.log(file);
    return true;
  }

  fileUploadChange(param: NzUploadChangeParam): void {
    if (param.type === 'success') {
      const serverFilePath = param.file.response.data;
      this.pictureFileId.set(this.findFileName(serverFilePath));
    }
  }

  downloadImage(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/user/image`;
    const obj:any = {companyCode: sessionStorage.getItem('companyCode'),  userId: this.userId()};
    const token = sessionStorage.getItem('token') as string;

    const options = {
      headers: new HttpHeaders().set('X-Auth-Token', token),
      responseType: 'blob' as 'json',
      withCredentials: true,
      params: obj
    };

    this.http.get<Blob>(url, options).pipe(
              //catchError(this.handleError<Blob>('downloadUserImage', undefined))
              )
             .subscribe(
              (model: Blob) => {
                const blob = new Blob([model], { type: 'application/octet-stream' });
                saveAs(blob, this.userId() + ".jpg");

                //this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
              }
            );;
  }

  getImageSrc() {
    if (!this.pictureFileId()) return '';

    let urlParams = new URLSearchParams();
    urlParams.set("companyCode", sessionStorage.getItem("companyCode")!);
    urlParams.set("userId", this.userId());

    //return this.imageSrc + this.pictureFileId;
    return this.imageSrc + '?' + urlParams;
  }

  private findFileName(path: string): string {
    const names: string[] = path.split("\\");
    return names[names.length-1];
  }

  onclick() {
    //location.href=this.imageSrc + this.imageBase64;
    saveAs(this.imageSrc + this.pictureFileId(), 'image.jpg');
  }

}
