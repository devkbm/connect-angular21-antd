import { AfterViewInit, Component, ElementRef, Input, Renderer2, effect, inject, input, output, signal, viewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadChangeParam, NzUploadComponent, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';
import { NzInputCkeditor } from 'src/app/third-party/ckeditor/nz-input-ckeditor';
import { NzFileUpload } from 'src/app/third-party/ng-zorro/nz-file-upload/nz-file-upload';

import { ResponseObject } from 'src/app/core/model/response-object';
import { GlobalProperty } from 'src/app/core/global-property';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { PostFileUpload } from './post-file-upload';
import { SessionManager } from 'src/app/core/session-manager';
import { HttpClient } from '@angular/common/http';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface Post {
  postId: string;
  boardId: string;
  postParentId: string;
  userId: string;
  title: string;
  contents: string;
  fileList: string[];
  file: File;
  editable: boolean
}



@Component({
  selector: 'post-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputCkeditor,
    NzCrudButtonGroup,
    //NzFileUploadComponent,
    PostFileUpload
  ],
  template: `
    {{fg.getRawValue() | json}}
    <!--{{fileList | json}}-->

    <form nz-form [formGroup]="fg" [nzLayout]="'vertical'" #form>

      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
      </ng-template>


      <nz-form-item>
        <nz-form-label nzFor="title" nzRequired>메뉴코드</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="title" formControlName="title" required
            placeholder="제목을 입력해주세요."
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="contents">내용</nz-form-label>
        <nz-form-control>
          @defer {
            <nz-input-ckeditor
              formControlName="contents"
              [itemId]="'contents'"
              [height]="'45vh'">
            </nz-input-ckeditor>
          }
        </nz-form-control>
      </nz-form-item>

      <post-file-upload
        [attachedFileList]="attachedFileList"
        [(uploadedFileList)]="uploadedfileList"
        (uploadCompleted)="closeForm()">
      </post-file-upload>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [searchVisible]="false"
        [isSavePopupConfirm]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove(fg.controls.postId.value)">
      </app-nz-crud-button-group>
    </div>

  `,
  styles: [`
    .footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
      z-index: 900;
    }

    :host ::ng-deep .ck-editor__editable {
      height: 45vh;
      color: black;
      /*min-height: calc(100% - 300px) !important;*/
    }

    :host ::ng-deep .upload-list-inline .ant-upload-list-item {
      float: left;
      width: 200px;
      margin-right: 8px;
    }

  `]
})
export class PostForm implements AfterViewInit {
  //public Editor = ClassicEditor;

  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  attachedFileList: any = [];
  uploadedfileList: any = [];

  textData: any;
  article!: Post;

  formElement = viewChild.required<ElementRef>('form');
  ckEditor = viewChild.required(CKEditorComponent);
  uploader = viewChild.required(PostFileUpload);
  uploaderParams = '';

  boardId = input<string>('');
  formDataId = input<string>('');

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    boardId         : new FormControl<string | null>(null, { validators: [Validators.required] }),
    postId          : new FormControl<string | null>(null, { validators: [Validators.required] }),
    postParentId    : new FormControl<string | null>(null),
    userId          : new FormControl<string | null>(null),
    title           : new FormControl<string | null>(null, { validators: [Validators.required] }),
    contents        : new FormControl<string | null>(null),
    isFiexedTop     : new FormControl<boolean | null>(false),
    attachFile      : new FormControl<any>(null)
  });

  constructor() {

    effect(() => {
      //console.log(this.boardId(), this.formDataId());
      if (this.formDataId()) {
        this.get(this.formDataId());
      } else {
        this.newForm(this.boardId());
      }
    })
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  focusInput() {
    this.renderer.selectRootElement('#title').focus();
  }

  newForm(boardId: any): void {
    this.fg.reset();
    this.fg.controls.boardId.setValue(boardId);

    this.fg.controls.userId.setValue(SessionManager.getUserId());
    this.fg.controls.isFiexedTop.setValue(false);
    this.uploadedfileList = [];
    this.textData = null;

    this.focusInput();
  }

  modifyForm(formData: Post): void {
    this.fg.reset();
    this.fg.patchValue(formData);

    // boardId, articleId는 base64로 암호화
    this.fg.controls.boardId.setValue(btoa(this.fg.controls.boardId.value!));
    this.fg.controls.postId.setValue(btoa(this.fg.controls.postId.value!));

    this.fg.controls.isFiexedTop.setValue(false);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());

    this.closePopup();
  }

  closePopup() {
    // 팝업 호출한 경우 팝업 종료
    if (window.opener) {
      window.opener.postMessage(this.boardId());
      window.close();
    }
  }

  get(id: any): void {
    const url = GlobalProperty.serverUrl() + `/api/grw/board/post/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<Post>>(url, options).pipe(
         // catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<Post>) => {
            if (model.data) {
              this.article = model.data;

              this.uploader().postId.set(model.data.postId);
              this.modifyForm(model.data);
              this.attachedFileList = model.data.fileList;
              //this.ckEditor.writeValue(model.data.contents);
            } else {
              this.newForm(null);
            }
          }
        )
  }

  save(): void {
    const url = GlobalProperty.serverUrl() + `/api/grw/board/post`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<string>>(url, this.fg.getRawValue(), options).pipe(
        //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<string>) => {
            //console.log(model);

            this.formSaved.emit(this.fg.getRawValue());

            this.uploader().postId.set(model.data);
            if (this.uploader().isUpload()) {
              this.uploader().upload();
            } else {
              this.closePopup();
            }
          }
        )

  }

  remove(id: any): void {
    const url = GlobalProperty.serverUrl() + `/api/grw/board/post/${id}`;
    const options = getHttpOptions();
    this.http
        .delete<ResponseObject<Post>>(url, options).pipe(
          //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<Post>) => {
            this.formDeleted.emit(this.fg.getRawValue());

            this.closePopup();
          }
        )
  }

  fileUploadChange(param: NzUploadChangeParam): void {
    console.log(param);
    if (param.type === 'success') {
      // this.fileList = param.file.response;
      this.uploadedfileList.push(param.file.response[0]);
    }
  }

  textChange({ editor }: ChangeEvent): void {

    //const data = editor.getData();
    //this.fg.get('contents')?.setValue(data);
  }


}
