import { Component, OnInit, Input, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';
import { GlobalProperty } from 'src/app/core/global-property';

import { saveAs } from 'file-saver';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzUploadModule, NzUploadChangeParam } from 'ng-zorro-antd/upload';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NzRadioModule } from 'ng-zorro-antd/radio';

export interface Staff {
  companyCode: string | null;
  staffNo: string | null;
  name: string | null;
  nameEng: string | null;
  nameChi: string | null;
  residentRegistrationNumber: string | null;
  gender: string | null;
  birthday: Date | null;
  workCondition: string | null;
  imagePath: string | null;
  deptHistory?: any;
  jobHistory?: any;
  deptChangeHistory?: any;
  jobChangeHistory?: any;
  statusChangeHistory?: any;
}

@Component({
  selector: 'staff-regist-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzDatePickerModule,
    NzAvatarModule,
    NzUploadModule,
    NzDividerModule,
    NzRadioModule,
    NgxMaskDirective,
  ],
  providers: [
    provideNgxMask()
  ],
  template: `
    <!--{{fg.getRawValue() | json}}-->
    <!--{{formModel | json}}-->
    <!--{{fileList | json}}-->

    <form nz-form [formGroup]="fg" nzLayout="vertical" style="padding: 0px; margin: 0px;">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <div class="img">
            <nz-avatar class="avatar" [nzShape]="'square'" [nzSize]='96' [nzSrc]="getImageSrc()"></nz-avatar>
          </div>
        </div>
        <div nz-col>
            <nz-upload
                [nzAction]="upload.url"
                [nzWithCredentials]="true"
                [nzShowUploadList]="false"
                [nzHeaders]="upload.headers"
                [nzData]="upload.data"
                (nzChange)="handleChange($event)">
              <button nz-button nzType="default" nzShape="round">
                <span nz-icon nzType="upload"></span>
              </button>
            </nz-upload>
            <button nz-button nzType="default" nzShape="round" (click)="downloadImage($event)"><span nz-icon nzType="download"></span></button>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="staffNo" nzRequired>직원번호</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="staffNo" formControlName="staffNo" required readonly/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="name" nzRequired>직원명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="name" formControlName="name" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="gender" nzRequired>성별</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-radio-group
                formControlName="gender" itemId="gender">
                @for (o of genderOptions; track o.value) {
                  <label nz-radio [nzValue]="o.value">{{ o.label }}</label>
                }
              </nz-radio-group>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="nameEng">직원명(영문)</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="nameEng" formControlName="nameEng"/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="nameChi">직원명(한문)</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="nameChi" formControlName="nameChi"/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12" >
          <nz-form-item>
            <nz-form-label nzFor="residentRegistrationNumber">주민등록번호</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input required
                nzId="residentRegistrationNumber" formControlName="residentRegistrationNumber"
                mask="000000-0000000"
              />
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="birthday">생년월일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="birthday" formControlName="birthday">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>
    </form>
    <nz-divider></nz-divider>

    <!--
    <div>
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (searchClick)="get(fg.get('staffId')?.value)"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove(this.fg.get('id')?.value)">
      </app-nz-crud-button-group>
    </div>
    -->

  `,
  styles: [``]
})
export class StaffRegistForm implements OnInit {

  @Input() staffNo?: string;

  imageUrl: string = '';

  upload: {url: string, headers:any, data: any} = {
    url: GlobalProperty.serverUrl() + '/api/hrm/staff/changeimage',
    headers: { Authorization: sessionStorage.getItem('token') },
    data: null
  }

  genderOptions = [
    {label: '남', value: 'M'},
    {label: '여', value: 'F'}
  ];

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    companyCode                 : new FormControl<string | null>(null, { validators: Validators.required }),
    staffNo                     : new FormControl<string | null>(null, { validators: Validators.required }),
    name                        : new FormControl<string | null>(null, { validators: Validators.required }),
    nameEng                     : new FormControl<string | null>(null),
    nameChi                     : new FormControl<string | null>(null),
    residentRegistrationNumber  : new FormControl<string | null>(null),
    gender                      : new FormControl<string | null>(null),
    birthday                    : new FormControl<Date | null>(null),
    workCondition               : new FormControl<string | null>(null),
    imagePath                   : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.newForm();
  }

  newForm(): void {
    this.fg.reset();
  }

  modifyForm(formData: Staff): void {
    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  getImageSrc() {
    if (!this.imageUrl) return '';

    let urlParams = new URLSearchParams();
    urlParams.set("companyCode", sessionStorage.getItem("companyCode")!);
    urlParams.set("staffNo", this.staffNo!);

    return GlobalProperty.serverUrl() + '/api/hrm/staff/downloadimage' + '?' + urlParams;
  }

  get(staffId: string): void {

    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<Staff>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<Staff>) => {
            if ( model.data ) {
              this.modifyForm(model.data);
              this.upload.data = { companyCode: model.data.companyCode, staffNo: model.data.staffNo };

              if (model.data.imagePath) {
                this.imageUrl = GlobalProperty.serverUrl() + '/api/hrm/staff/downloadimage';
              } else {
                this.imageUrl = '';
              }
            } else {
              this.newForm();
            }
          }
      )
  }

  save(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<Staff>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<Staff>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(id: any): void {
    /*this.appointmentCodeService
        .deleteAppointmentCodeDetail(this.fg.get('code').value)
        .subscribe(
            (model: ResponseObject<AppointmentCodeDetail>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
            },
            (err) => {
            console.log(err);
            },
            () => {}
        );*/
  }

  handleChange(param: NzUploadChangeParam): void {
    console.log(param);
    if (param.type === 'success') {
      const serverFilePath = param.file.response.data;
      //this.imageUrl = GlobalProperty.serverUrl() + '/api/system/fileimage/' + this.findFileName(serverFilePath);
      this.imageUrl = GlobalProperty.serverUrl() + '/api/hrm/staff/downloadimage';
    }
  }

  private findFileName(path: string): string {
    const names: string[] = path.split("\\");
    return names[names.length-1];
  }

  downloadImage(params: any): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/downloadimage`;
    const obj:any = {staffNo: this.fg.controls.staffNo.value!};
    const token = sessionStorage.getItem('token') as string;

    const options = {
      headers: new HttpHeaders().set('X-Auth-Token', token),
      responseType: 'blob' as 'json',
      withCredentials: true,
      params: obj
    };

    this.http
        .get<Blob>(url, options).pipe(
        //  catchError(this.handleError<Blob>('downloadEmployeeImage', undefined))
        )
        .subscribe(
          (model: Blob) => {
            //this.notifyService.changeMessage(model.message);
            const blob = new Blob([model], { type: 'application/octet-stream' });
            saveAs(blob, this.fg.get('staffNo')?.value+".jpg");
          }
        )
  }

}
