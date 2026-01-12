import { Component, OnInit, AfterViewInit, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { HrmCodeService, HrmCode } from '../../shared/hrm-code.service';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface StaffDutyResponsibility {
  staffNo: string | null;
  staffName: string | null;
  seq: string | null;
  dutyResponsibilityCode: string | null;
  dutyResponsibilityName: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  isPayApply: boolean | null;
}

@Component({
  selector: 'staff-duty-responsibility-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzSelectModule,
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="duty_staffNo" nzRequired>직원번호</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="duty_staffNo" formControlName="staffNo" required
                placeholder="직원번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="duty_staffName" nzRequired>직원명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="duty_staffName" formControlName="staffName" required
                placeholder="직원명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="4">
          <nz-form-item>
            <nz-form-label nzFor="seq" nzRequired>순번</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="seq" formControlName="seq" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="dutyResponsibilityCode" nzRequired>직책</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="dutyResponsibilityCode" formControlName="dutyResponsibilityCode">
                @for (option of dutyResponsibilityCodeList; track option) {
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
            <nz-form-label nzFor="fromDate" nzRequired>시작일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="fromDate" formControlName="fromDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="toDate" nzRequired>종료일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="toDate" formControlName="toDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="2">
          <nz-form-item>
            <nz-form-label nzFor="isPayApply">급여적용</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <label nz-checkbox nzId="isPayApply" formControlName="isPayApply"></label>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>
    </form>
  `,
  styles: []
})
export class StaffDutyResponsibilityForm implements OnInit, AfterViewInit {

  /**
   * 직책코드 - HR0007
   */
  dutyResponsibilityCodeList: HrmCode[] = [];

  hrmCodeService = inject(HrmCodeService);
  notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
      staffNo                 : new FormControl<string | null>(null, { validators: Validators.required }),
      staffName               : new FormControl<string | null>(null),
      seq                     : new FormControl<string | null>({value: null, disabled: true}, { validators: [Validators.required] }),
      dutyResponsibilityCode  : new FormControl<string | null>(null),
      dutyResponsibilityName  : new FormControl<string | null>(null),
      fromDate                : new FormControl<Date | null>(null),
      toDate                  : new FormControl<Date | null>(null),
      isPayApply              : new FormControl<boolean | null>(null)
    });

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

  ngOnInit(): void {
    this.getHrmTypeDetailCodeList('HR0007', "dutyResponsibilityCodeList");
  }

  ngAfterViewInit(): void {
  }


  newForm(): void {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }
  }

  modifyForm(formData: StaffDutyResponsibility): void {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();
    this.fg.controls.seq.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, seq: string): void {

    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}/dutyresponsibility/${seq}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<StaffDutyResponsibility>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffDutyResponsibility>>('getCurrentAppointment', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffDutyResponsibility>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
          }
        )
  }

  save(): void {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo}/dutyresponsibility`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<StaffDutyResponsibility>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffDutyResponsibility>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffDutyResponsibility>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(typeCode: string, detailCode: string): void {
    /*
    this.service
        .delete(typeCode, detailCode)
        .subscribe(
          (model: ResponseObject<StaffDutyResponsibility>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
    */
  }


  getHrmTypeDetailCodeList(typeId: string, propertyName: string): void {
    const params = {
      typeId : typeId
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            this.dutyResponsibilityCodeList = model.data;
          }
      );

  }
}
