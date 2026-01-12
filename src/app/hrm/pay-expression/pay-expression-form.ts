import { Component, ChangeDetectionStrategy, inject, output, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';

import { PayItemResource } from '../shared/pay-item-resource';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';


export interface PayExpression {
  id: string | null;
  companyCode: string | null;
  payItemCode: string | null;
  payCondition: string | null;
  formula: string | null;
  seq: number | null;
  comment: string | null;
}

@Component({
  selector: 'pay-expression-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzCheckboxModule,
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
            <nz-form-label nzFor="seq" nzRequired>순번</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="seq" formControlName="seq" required
                [nzMin]="0" [nzMax]="9999" placeholder="순번을 입력해주세요.">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>


      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="payCondition" nzRequired>급여조건</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="payCondition" formControlName="payCondition" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="formula" nzRequired>계산식</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="formula" formControlName="formula" required/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="comment">비고</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="comment" formControlName="comment"/>
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
export class PayExpressionForm {
  private http = inject(HttpClient);
  protected payItemResource = new PayItemResource();

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    id                : new FormControl<string | null>(null),
    companyCode       : new FormControl<string | null>(null, { validators: Validators.required }),
    payItemCode       : new FormControl<string | null>(null, { validators: Validators.required }),
    payCondition      : new FormControl<string | null>(null),
    formula           : new FormControl<string | null>(null),
    seq               : new FormControl<number | null>(null),
    comment           : new FormControl<string | null>(null)
  });

  formDataId = input<string>();

  constructor() {
    this.payItemResource.reload();

    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()!);
      } else {
        this.fg.reset();
      }
    })
  }

  newForm(): void {
    this.fg.reset();
  }

  modifyForm(formData: PayExpression): void {
    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/payexpression/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<PayExpression>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<PayExpression>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();
          }
    )
  }

  save(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/payexpression`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<PayExpression>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<PayExpression>) => {
            //this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove() {

  }
}
