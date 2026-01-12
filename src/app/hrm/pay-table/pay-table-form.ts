import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseMap } from 'src/app/core/model/response-map';

import { HrmCode, HrmCodeService } from '../shared/hrm-code.service';
import { PayItemResource } from '../shared/pay-item-resource';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface PayTable {
  id: string | null;
  companyCode: string | null;
  payItemCode: string | null;
  effectiveDate: Date | null;
  occupationCode: string | null;
  jobGradeCode: string | null;
  payStepCode: string | null;
  wageAmount: number | null;
  isEnable: boolean | null;
  comment: string | null;
}

@Component({
  selector: 'pay-table-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzDatePickerModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
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
            <nz-form-label nzFor="payItemCode" nzRequired>급여항목코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <!--<input nz-input id="payItemCode" formControlName="payItemCode" required/>-->
              <nz-select nzId="payItemCode" formControlName="payItemCode">
                @for (option of payItemResource.data(); track option) {
                  <nz-option
                    [nzLabel]="option.payItemName"
                    [nzValue]="option.payItemCode">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="effectiveDate" nzRequired>적용일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="effectiveDate" formControlName="effectiveDate" required></nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="occupationCode">직종</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <!--<input nz-input id="occupationCode" formControlName="occupationCode"/>-->
              <nz-select nzId="occupationCode" formControlName="occupationCode">
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
            <nz-form-label nzFor="jobGradeCode">직급</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <!--<input nz-input id="jobGradeCode" formControlName="jobGradeCode"/>-->
              <nz-select nzId="jobGradeCode" formControlName="jobGradeCode">
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
            <nz-form-label nzFor="payStepCode">호봉</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <!--<input nz-input id="payStepCode" formControlName="payStepCode"/>-->
              <nz-select nzId="payStepCode" formControlName="payStepCode">
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

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="wageAmount">금액</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="wageAmount" formControlName="wageAmount" required></nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayTableForm {
  private http = inject(HttpClient);
  private hrmCodeService = inject(HrmCodeService);
  protected payItemResource = new PayItemResource();

  [key: string]: any;
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

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    id                : new FormControl<string | null>(null, { validators: Validators.required }),
    companyCode       : new FormControl<string | null>(null, { validators: Validators.required }),
    payItemCode       : new FormControl<string | null>(null),
    effectiveDate     : new FormControl<Date | null>(null),
    occupationCode    : new FormControl<string | null>(null),
    jobGradeCode      : new FormControl<string | null>(null),
    payStepCode       : new FormControl<string | null>(null),
    wageAmount        : new FormControl<number | null>(null),
    isEnable          : new FormControl<boolean | null>(null),
    comment           : new FormControl<string | null>(null),
  });

  formDataId = input<string>();

  constructor() {
    this.getCodeMap([
      {typeId: 'HR0003', propertyName: "occupationCodeList"},
      {typeId: 'HR0004', propertyName: "jobGradeCodeList"},
      {typeId: 'HR0005', propertyName: "payStepCodeList"},
    ]);

    this.payItemResource.reload();

    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()!);
      }
    })
  }


  newForm(): void {
    this.fg.reset();
  }

  modifyForm(formData: PayTable): void {
    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/paytable/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<PayTable>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<PayTable>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();
          }
    )
  }

  save(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/paytable`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<PayTable>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<PayTable>) => {
            //this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove() {
    const url = GlobalProperty.serverUrl() + `/api/hrm/paytable/${this.fg.controls.id.value}`;
    const options = getHttpOptions()

    this.http
        .delete<ResponseObject<PayTable>>(url, options).pipe(
      //     catchError(this.handleError<ResponseObject<User>>('deleteUser', undefined))
        )
        .subscribe(
          (model: ResponseObject<PayTable>) => {
            //this.notifyService.changeMessage(model.message);
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
