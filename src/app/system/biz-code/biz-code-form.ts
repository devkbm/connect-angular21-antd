import { Component, AfterViewInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

export interface BizCodeFormData {
  typeId: string | null;
  code: string | null;
  codeName: string | null;
  useYn: boolean | null;
  sequence: number | null;
  comment: string | null;
}


@Component({
  selector: 'biz-code-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzInputNumberModule,

],
  template: `
    {{fg.getRawValue() | json}}
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
            <nz-form-label nzFor="typeId" nzRequired>업무코드분류ID</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="typeId" formControlName="typeId" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="code" nzRequired>코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="code" formControlName="code" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="codeName" nzRequired>코드명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="codeName" formControlName="codeName" required/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="useYn" nzRequired>사용여부</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <label nz-checkbox nzId="useYn" formControlName="useYn"></label>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="sequence" nzRequired>순번</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="sequence" formControlName="sequence" required
                [nzMin]="0" [nzMax]="9999">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="comment" nzRequired>비고</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="비고를 입력해주세요." [rows]="20">
              </textarea>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

    </form>
  `,
  styles: []
})
export class BizCodeForm implements AfterViewInit {

  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    typeId      : new FormControl<string | null>(null, { validators: [Validators.required] }),
    code        : new FormControl<string | null>(null, { validators: [Validators.required] }),
    codeName    : new FormControl<string | null>(null),
    useYn       : new FormControl<boolean | null>(null),
    sequence    : new FormControl<number | null>(null),
    comment     : new FormControl<string | null>(null)
  });

  formDataId = input<{typeId: string, code: string}>();

  constructor() {

    effect(() => {
      if (this.formDataId()) {
        if (this.formDataId()?.typeId && this.formDataId()?.code) {
          this.get(this.formDataId()?.typeId!, this.formDataId()?.code!);
        } else if (this.formDataId()?.typeId) {
          this.newForm(this.formDataId()?.typeId!);
        }
      }
    });
  }

  ngAfterViewInit(): void {
  }

  focusInput() {
    this.renderer.selectRootElement('#code').focus();
  }

  newForm(typeId: string): void {
    this.fg.controls.typeId.setValue(typeId);
    this.fg.controls.code.enable();
    this.fg.controls.useYn.setValue(true);

    this.focusInput();
  }

  modifyForm(formData: BizCodeFormData): void {
    this.fg.controls.code.disable();
    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(typeId: string, code: string): void {
    const url =  GlobalProperty.serverUrl() + `/api/system/bizcodetype/${typeId}/bizcode/${code}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<BizCodeFormData>>(url, options).pipe(
         // catchError(this.handleError<ResponseObject<BizCode>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<BizCodeFormData>) => {
            model.data ? this.modifyForm(model.data) : this.newForm(typeId)
            this.notifyService.changeMessage(model.message);
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

    const url =  GlobalProperty.serverUrl() + `/api/system/bizcodetype/bizcode`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<BizCodeFormData>>(url, this.fg.getRawValue(), options).pipe(
          //catchError(this.handleError<ResponseObject<BizCode>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<BizCodeFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const url =  GlobalProperty.serverUrl() + `/api/system/bizcodetype/${this.fg.controls.typeId.value!}/bizcode/${this.fg.controls.code.value!}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<BizCodeFormData>>(url, options).pipe(
         // catchError(this.handleError<ResponseObject<BizCode>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<BizCodeFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

}
