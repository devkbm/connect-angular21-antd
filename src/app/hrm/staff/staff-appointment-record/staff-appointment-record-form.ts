import { Component, OnInit, Input, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseMap } from 'src/app/core/model/response-map';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { HrmCodeService, HrmCode } from '../../shared/hrm-code.service';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { DeptResourceService } from 'src/app/shared-service/dept-resource-service';

export interface StaffAppointmentRecord {
  staffNo: string | null;
  staffName: string | null;
  seq: string | null;
  appointmentTypeCode: string | null;
  applyType: string | null;
  appointmentDate: Date | null;
  appointmentEndDate: Date | null;
  recordName: string | null;
  comment: string | null;
  isCompleted: boolean | null;
  blngDeptCode: string | null;
  workDeptCode: string | null;
  jobGroupCode: string | null;
  jobPositionCode: string | null;
  occupationCode: string | null;
  jobGradeCode: string | null;
  payStepCode: string | null;
  jobCode: string | null;
  dutyResponsibilityCode: string | null;
}


@Component({
  selector: 'staff-appointment-record-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzDividerModule,
    NzSelectModule,
    NzTreeSelectModule,
  ],
  template: `
    {{fg.value | json}}
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
            <nz-form-label nzFor="staffNo" nzRequired>직원번호</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="staffNo" formControlName="staffNo" required
                placeholder="직원번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="staffName" nzRequired>직원명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="staffName" formControlName="staffName" required
                placeholder="직원명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <div nz-row nzGutter="8">

        <div nz-col nzSpan="4">
          <nz-form-item>
            <nz-form-label nzFor="seq">발령순번</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="seq" formControlName="seq" readonly
                placeholder="신규"/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item>
            <nz-form-label nzFor="appointmentTypeCode" nzRequired>발령분류</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="appointmentTypeCode" formControlName="appointmentTypeCode"
                nzPlaceHolder="Please select">
                @for (option of appointmentTypeList; track option) {
                  <nz-option
                    [nzLabel]="option.codeName"
                    [nzValue]="option.code">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item>
            <nz-form-label nzFor="applyType" nzRequired>적용구분</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="applyType" formControlName="applyType"
                nzPlaceHolder="Please select">
                @for (option of applyTypeList; track option) {
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
            <nz-form-label nzFor="appointmentDate" nzRequired>발령일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="appointmentDate" formControlName="appointmentDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="appointmentEndDate">발령종료일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="appointmentEndDate" formControlName="appointmentEndDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="recordName" nzRequired>발령내용</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="recordName" formControlName="recordName" required
                placeholder="발령내용을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="comment" nzRequired>비고</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="comment" formControlName="comment" required
                placeholder="비고내용을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <nz-divider nzPlain nzText="발령 내역" nzOrientation="center"></nz-divider>
      <!-- 4 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="blngDeptCode" nzRequired>소속부서</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-tree-select
                nzId="blngDeptCode"
                formControlName="blngDeptCode"
                [nzNodes]="deptResource.getData()!"
                >
              </nz-tree-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="workDeptCode" nzRequired>근무부서</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-tree-select
                nzId="workDeptCode"
                formControlName="workDeptCode"
                [nzNodes]="deptResource.getData()!"
                >
              </nz-tree-select>

            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="dutyResponsibilityCode">직책</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="dutyResponsibilityCode" formControlName="dutyResponsibilityCode"
                nzPlaceHolder="Please select">
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
      </div>


      <!-- 5 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="jobGroupCode" nzRequired>직군</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="jobGroupCode" formControlName="jobGroupCode"
                nzPlaceHolder="Please select">
                @for (option of groupJobCodeList; track option) {
                  <nz-option
                    [nzLabel]="option.codeName"
                    [nzValue]="option.code">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="jobPositionCode" nzRequired>직위</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="jobPositionCode" formControlName="jobPositionCode"
                nzPlaceHolder="Please select">
                @for (option of jobPositionCodeList; track option) {
                  <nz-option
                    [nzLabel]="option.codeName"
                    [nzValue]="option.code">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="jobCode" nzRequired>직무</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="jobCode" formControlName="jobCode"
                nzPlaceHolder="Please select">
                @for (option of jobCodeList; track option) {
                  <nz-option
                    [nzLabel]="option.codeName"
                    [nzValue]="option.code">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 6 row-->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="occupationCode" nzRequired>직종</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="occupationCode" formControlName="occupationCode"
                nzPlaceHolder="Please select">
                @for (option of occupationCodeList; track option) {
                  <nz-option
                    [nzLabel]="option.codeName"
                    [nzValue]="option.code">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="jobGradeCode" nzRequired>직급</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="jobGradeCode" formControlName="jobGradeCode"
                nzPlaceHolder="Please select">
                @for (option of jobGradeCodeList; track option) {
                  <nz-option
                    [nzLabel]="option.codeName"
                    [nzValue]="option.code">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="payStepCode" nzRequired>호봉</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="payStepCode" formControlName="payStepCode"
                nzPlaceHolder="Please select">
                @for (option of payStepCodeList; track option) {
                  <nz-option
                    [nzLabel]="option.codeName"
                    [nzValue]="option.code">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class StaffAppointmentRecordForm implements OnInit {

  bizTypeList = [{code:'code', name:'name'},{code:'code2', name:'name2'}];

  applyTypeList = [{code:'10', codeName:'예약적용'},{code:'02', codeName:'즉시적용'}];

  /**
   * https://soopdop.github.io/2020/12/01/index-signatures-in-typescript/
   * string literal로 접근하기위한 변수
   */
  [key: string]: any;

  /**
   * 발령분류코드 - HR0000
   */
  appointmentTypeList: HrmCode[] = [];
  /**
   * 직군코드 - HR0001
   */
  groupJobCodeList: HrmCode[] = [];
  /**
   * 직위코드 - HR0002
   */
  jobPositionCodeList: HrmCode[] = [];
  /**
   * 직종코드 - HR0003
   */
  occupationCodeList: HrmCode[] = [];
  /**
   * 직급코드 - HR0004
   */
  jobGradeCodeList: HrmCode[] = [];
  /**
   * 호봉코드 - HR0005
   */
  payStepCodeList: HrmCode[] = [];
  /**
   * 직무코드 - HR0006
   */
  jobCodeList: HrmCode[] = [];
  /**
   * 직책코드 - HR0007
   */
  dutyResponsibilityCodeList: HrmCode[] = [];

  private http = inject(HttpClient);
  private hrmCodeService = inject(HrmCodeService);
  private notifyService = inject(NotifyService);
  deptResource = inject(DeptResourceService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
      staffNo                 : new FormControl<string | null>(null, { validators: Validators.required }),
      staffName               : new FormControl<string | null>(null),
      seq                     : new FormControl<string | null>(null),
      appointmentTypeCode     : new FormControl<string | null>(null),
      applyType               : new FormControl<string | null>(null),
      appointmentDate         : new FormControl<Date | null>(null),
      appointmentEndDate      : new FormControl<Date | null>(null),
      recordName              : new FormControl<string | null>(null),
      comment                 : new FormControl<string | null>(null),
      isCompleted             : new FormControl<boolean | null>(null),
      blngDeptCode            : new FormControl<string | null>(null),
      workDeptCode            : new FormControl<string | null>(null),
      jobGroupCode            : new FormControl<string | null>(null),
      jobPositionCode         : new FormControl<string | null>(null),
      occupationCode          : new FormControl<string | null>(null),
      jobGradeCode            : new FormControl<string | null>(null),
      payStepCode             : new FormControl<string | null>(null),
      jobCode                 : new FormControl<string | null>(null),
      dutyResponsibilityCode  : new FormControl<string | null>(null)
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

    this.getCodeMap([
      {typeId: 'HR0000', propertyName: "appointmentTypeList"},
      {typeId: 'HR0001', propertyName: "groupJobCodeList"},
      {typeId: 'HR0002', propertyName: "jobPositionCodeList"},
      {typeId: 'HR0003', propertyName: "occupationCodeList"},
      {typeId: 'HR0004', propertyName: "jobGradeCodeList"},
      {typeId: 'HR0005', propertyName: "payStepCodeList"},
      {typeId: 'HR0006', propertyName: "jobCodeList"},
      {typeId: 'HR0007', propertyName: "dutyResponsibilityCodeList"}
    ]);

  }

  newForm(): void {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff) {
      //this.fg.controls.staffId.setValue(this.staff?.staffId);
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }

  }

  modifyForm(formData: StaffAppointmentRecord): void {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    //grid.getGridList(this.fg.get('staffId')?.value);
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}/appointmentrecord/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<StaffAppointmentRecord>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffAppointmentRecord>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffAppointmentRecord>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
          }
        )
  }

  save(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo.value}/appointmentrecord`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<StaffAppointmentRecord>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffAppointmentRecord>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffAppointmentRecord>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(staffId: string, id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}/appointmentrecord/${id}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<StaffAppointmentRecord>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffAppointmentRecord>>('delete', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffAppointmentRecord>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

  getCodeMap(objs: {typeId: string,  propertyName: string}[]): void {

    const params = {
      typeIds : objs.map(e => e.typeId)
    };

    this.hrmCodeService
        .getMapList(params)
        .subscribe(
          (model: ResponseMap<HrmCode>) => {
            if ( model.data ) {
              let data: any = model.data;

              for (const obj of objs) {
                this[obj.propertyName] = data[obj.typeId];
              }
            } else {
              //list = [];
            }
          }
      );

  }

}
