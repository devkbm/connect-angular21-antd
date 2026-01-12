import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';


import { HrmCodeService, HrmCode } from '../../shared/hrm-code.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface StaffLicense {
  staffNo: string | null;
  staffName: string | null;
  seq: string | null;
  licenseType: string | null;
	licenseNumber: string | null;
	dateOfAcquisition: Date | null;
  certificationAuthority: string | null;
	comment: string | null;
}

@Component({
  selector: 'staff-license-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
  ],
  template: `
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

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="licenseType" nzRequired>자격면허</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="licenseType" formControlName="licenseType">
                @for (option of licenseTypeList; track option) {
                  <nz-option
                    [nzLabel]="option.codeName"
                    [nzValue]="option.code">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="licenseNumber" nzRequired>자격면허 번호</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="licenseNumber" formControlName="licenseNumber" required
                placeholder="자격면허 번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="dateOfAcquisition" nzRequired>취득일자</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="dateOfAcquisition" formControlName="dateOfAcquisition">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="certificationAuthority">인증기관</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="certificationAuthority" formControlName="certificationAuthority"
                placeholder="인증기관을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="comment">비고</nz-form-label>
            <nz-form-control>
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="비고를 입력해주세요." [rows]="23">
              </textarea>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>

    <!--
    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        [deleteVisible]="true"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove(fg.controls.staffNo.value!, fg.controls.seq.value!)">
      </app-nz-crud-button-group>
    </div>
      -->
  `,
  styles: []
})
export class StaffLicenseForm implements OnInit, AfterViewInit, OnChanges {

  /**
   * 자격면허 - HR0011
   */
  licenseTypeList: HrmCode[] = [];

  hrmCodeService = inject(HrmCodeService);
  notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    staffNo                 : new FormControl<string | null>(null, { validators: Validators.required }),
    staffName               : new FormControl<string | null>(null, { validators: Validators.required }),
    seq                     : new FormControl<string | null>(null),
    licenseType             : new FormControl<string | null>(null, { validators: Validators.required }),
    licenseNumber           : new FormControl<string | null>(null, { validators: Validators.required }),
    dateOfAcquisition       : new FormControl<Date | null>(null),
    certificationAuthority  : new FormControl<string | null>(null),
    comment                 : new FormControl<string | null>(null)
  });

  //@Input() staff?: {companyCode: string, staffNo: string, staffName: string};
  formDataId = input<{staffId: string, seq: string}>();
  staff = input<{companyCode: string, staffNo: string, staffName: string}>();

  constructor() {
    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()?.staffId!, this.formDataId()?.seq!);
      } else {
        this.newForm();
      }
    })
  }

  ngOnInit() {
    this.getLicenseTypeList();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  newForm() {
    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }
  }


  modifyForm(formData: StaffLicense) {
    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }

    //this.fg.get('database')?.disable();
    //this.fg.get('domainName')?.disable();

    this.fg.patchValue(formData);
  }


  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, seq: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}/license/${seq}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<StaffLicense>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffLicense>>('getCurrentAppointment', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffLicense>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();
          }
        )
  }

  save() {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo.value}/license`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<StaffLicense>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffLicense>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffLicense>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo.value}/license/${this.fg.controls.seq.value}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<StaffLicense>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffLicense>>('delete', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffLicense>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )
  }

  getLicenseTypeList() {
    const params = {
      typeId : 'HR0011'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            this.licenseTypeList = model.data;
          }
      );
  }

}
