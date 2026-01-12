import { Component, ChangeDetectionStrategy, inject, output, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';


import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';

export interface PartnerStaff {
  companyCode: string | null;
  staffNo: string | null;
  name: string | null;
  nameEng?: string | null ;
  nameChi: string | null;
  gender: string | null;
  birthday: Date | null;
  partnerCompanyCode: string | null;
  joinDate: Date | null;
  retireDate: Date | null;
  blngDeptCode: string | null;
  workDeptCode: string | null;
}

@Component({
  selector: 'partner-staff-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,

  ],
  template: `
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
      </div>


    </form>
  `,
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerStaffForm {

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
    gender                      : new FormControl<string | null>(null),
    birthday                    : new FormControl<Date | null>(null),
    partnerCompanyCode          : new FormControl<string | null>(null),
    joinDate                    : new FormControl<Date | null>(null),
    retireDate                  : new FormControl<Date | null>(null),
    blngDeptCode                : new FormControl<string | null>(null),
    workDeptCode                : new FormControl<string | null>(null),
  });

  formDataId = input<string>('');

  constructor() {
    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId());
      }
    })
  }

  newForm(): void {
    this.fg.reset();
  }

  modifyForm(formData: PartnerStaff): void {
    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffNo: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/partnerstaff/${staffNo}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<PartnerStaff>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<PartnerStaff>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();
          }
      )
    }

    save(): void {
      const url = GlobalProperty.serverUrl() + `/api/hrm/partnerstaff`;
      const options = getHttpOptions();

      this.http
          .post<ResponseObject<PartnerStaff>>(url, this.fg.getRawValue(), options).pipe(
          //  catchError(this.handleError<ResponseObject<Staff>>('save', undefined))
          )
          .subscribe(
            (model: ResponseObject<PartnerStaff>) => {
              //this.notifyService.changeMessage(model.message);
              this.formSaved.emit(this.fg.getRawValue());
            }
          )
    }

}
