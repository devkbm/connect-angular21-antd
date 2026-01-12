import { Component, ChangeDetectionStrategy, inject, output, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';


export interface PayItem {
  companyCode: string | null;
  payItemCode: string | null;
  payItemName: string | null;
  type: string | null;
  usePayTable: boolean;
  seq: number | null;
  comment: string | null;
}

@Component({
  selector: 'pay-item-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzSwitchModule

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
              <input nz-input id="payItemCode" formControlName="payItemCode" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="payItemName" nzRequired>급여항목명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="payItemName" formControlName="payItemName" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="type" nzRequired>구분</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="type" formControlName="type"/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>


      <div nz-row nzGutter="8">

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="usePayTable">급여테이블Y/N</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-switch nzId="usePayTable" formControlName="usePayTable"></nz-switch>
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

    </form>
  `,
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayItemForm {
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    companyCode       : new FormControl<string | null>(null, { validators: Validators.required }),
    payItemCode       : new FormControl<string | null>(null, { validators: Validators.required }),
    payItemName       : new FormControl<string | null>(null),
    type              : new FormControl<string | null>(null),
    usePayTable       : new FormControl<boolean>(false),
    seq               : new FormControl<number | null>(null),
    comment           : new FormControl<string | null>(null)
  });

  formDataId = input<string>();

  constructor() {
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

  modifyForm(formData: PayItem): void {
    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/payitem/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<PayItem>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<PayItem>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();
          }
    )
  }

  save(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/payitem`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<PayItem>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<PayItem>) => {
            //this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove() {

  }
}
