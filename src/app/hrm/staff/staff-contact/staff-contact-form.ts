import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';
import { NzListRoadAddressComponent } from 'src/app/third-party/ng-zorro/nz-list-road-address/nz-list-road-address.component';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';

export interface StaffContact {
  staffNo: string | null;
  staffName: string | null;
  homeAddressType: string | null;
  homePostNumber: string | null;
  homeMainAddress: string | null;
  homeSubAddress: string | null;
  extensionNumber: string | null;
  mobileNumber: string | null;
}


@Component({
  selector: 'staff-contact-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDividerModule,
    NzListRoadAddressComponent,
    NzCrudButtonGroup,

  ],
  template: `
    <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        [deleteVisible]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()">
    </app-nz-crud-button-group>

    {{fg.getRawValue() | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <nz-divider nzText="주민등록지" nzOrientation="left" nzPlain nzVariant="solid"></nz-divider>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="2">
          <nz-form-item>
            <nz-form-label nzFor="contact_homePostNumber">우편번호</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_homePostNumber" formControlName="homePostNumber"
                placeholder="우편번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="contact_homeMainAddress">기본주소</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_homeMainAddress" formControlName="homeMainAddress"
                placeholder="기본주소를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="10">
          <nz-form-item>
            <nz-form-label nzFor="contact_homeSubAddress">상세주소</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_homeSubAddress" formControlName="homeSubAddress"
                placeholder="상세주소를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="contact_extensionNumber">내선번호</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_extensionNumber" formControlName="extensionNumber"
                placeholder="내선번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="contact_mobileNumber">휴대번호</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_mobileNumber" formControlName="mobileNumber"
                placeholder="휴대번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>

    <nz-divider nzText="주소 검색" nzOrientation="left" nzPlain nzVariant="solid"></nz-divider>

    <app-nz-list-road-address
      [height]="'300px'"
      [countPerPage]="5"
      (itemClicked)="changeRoadAddress($event)">
    </app-nz-list-road-address>

  `,
  styles: [`
    .footer {
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
      padding: 10px 16px;
      border-top: 1px solid rgb(232, 232, 232);
      text-align: right;
      /*background-color: black;*/
    }
  `]
})
export class StaffContactForm implements OnInit, AfterViewInit, OnChanges {

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    //staffId           : new FormControl<string | null>(null, { validators: Validators.required }),
    staffNo           : new FormControl<string | null>(null, { validators: Validators.required }),
    staffName         : new FormControl<string | null>(null, { validators: Validators.required }),
    homeAddressType   : new FormControl<string | null>(null, { validators: Validators.required }),
    homePostNumber    : new FormControl<string | null>(null, { validators: Validators.required }),
    homeMainAddress   : new FormControl<string | null>(null),
    homeSubAddress    : new FormControl<string | null>(null),
    extensionNumber   : new FormControl<string | null>(null),
    mobileNumber      : new FormControl<string | null>(null)
  });

  //@Input() staff?: {companyCode: string, staffNo: string, staffName: string};
  formDataId = input<{staffId: string, seq: string}>();
  staff = input<{companyCode: string, staffNo: string, staffName: string}>();

  constructor() {
    effect(() => {
      if (this.staff()) {
        this.get(this.staff()?.staffNo!);
      } else {
        this.newForm();
      }
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }

  newForm() {
    this.fg.controls.homePostNumber.disable();
    this.fg.controls.homeMainAddress.disable();

    if (this.staff) {
      //this.fg.controls.staffId.setValue(this.staff?.staffId);
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }
  }


  modifyForm(formData: StaffContact) {
    this.fg.controls.homePostNumber.disable();
    this.fg.controls.homeMainAddress.disable();

    if (this.staff) {
      //this.fg.controls.staffId.setValue(this.staff?.staffId);
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}/contact`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<StaffContact>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffContact>>('getStaffAppointmentRecord', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffContact>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();
          }
        )
  }

  save() {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo.value}/contact`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<StaffContact>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffContact>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffContact>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )
  }

  // {roadAddress: string, zipNo: string}
  changeRoadAddress(item: any) {
    this.fg.get('homeMainAddress')?.setValue(item.roadAddress);
    this.fg.get('homePostNumber')?.setValue(item.zipNo);
    this.fg.get('homeSubAddress')?.setValue(null);
  }

}
