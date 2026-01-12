import { Component, OnInit, AfterViewInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { WebResourceFormValidatorService } from './validator/web-resource-form-validator.service';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface ResouceTypeEnum {
  label: string;
  value: string;
}

export interface WebResourceFormData {
  resourceId: string | null;
  resourceName: string | null;
  resourceType: string | null;
  url: string | null;
  description: string | null;
}

@Component({
  selector: 'web-resource-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,


  ],
  template: `
    {{fg.getRawValue()| json}} - {{fg.valid}}

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

      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="resourceId" nzRequired>리소스ID</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="resourceId" formControlName="resourceId" required
                placeholder="리소스ID를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="resourceName" nzRequired>리소스명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="resourceName" formControlName="resourceName" required/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="resourceType" nzRequired>리소스타입</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="resourceType" formControlName="resourceType">
                @for (option of resourceTypeList; track option) {
                  <nz-option
                    [nzLabel]="option.label"
                    [nzValue]="option.value">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="url" nzRequired>URL 정보</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="url" formControlName="url" required
                placeholder="URL 정보를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="description">설명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="description" formControlName="description"
                placeholder="설명를 입력해주세요." [rows]="10">
              </textarea>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class WebResourceForm implements OnInit, AfterViewInit {

  resourceTypeList: ResouceTypeEnum[] = [];

  private http = inject(HttpClient);
  private validator = inject(WebResourceFormValidatorService);
  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    resourceId   : new FormControl<string | null>(null, {
      validators: Validators.required,
      asyncValidators: [this.validator.existingEntityValidator()],
      updateOn: 'blur'
    }),
    resourceName  : new FormControl<string | null>('', {validators: [Validators.required]}),
    resourceType  : new FormControl<string | null>('', {validators: [Validators.required]}),
    url           : new FormControl<string | null>('', {validators: [Validators.required]}),
    description   : new FormControl<string | null>(null)
  });

  formDataId = input<string>('');

  constructor() {

    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId());
      }
    })
  }

  ngOnInit(): void {
    this.getCommonCodeList();
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  focusInput() {
    this.renderer.selectRootElement('#resourceId').focus();
  }

  newForm(): void {
    this.fg.reset();
    this.fg.controls.resourceId.enable();
    this.focusInput();
  }

  modifyForm(formData: WebResourceFormData): void {
    this.fg.controls.resourceId.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/system/webresource/${id}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<WebResourceFormData>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseObject<WebResourceFormData>) => {
        model.data ? this.modifyForm(model.data) : this.newForm();
      }
    );
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

    const url = GlobalProperty.serverUrl() + `/api/system/webresource`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<WebResourceFormData>>(url, this.fg.getRawValue(), options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseObject<WebResourceFormData>) => {
        this.notifyService.changeMessage(model.message);
        this.formSaved.emit(this.fg.getRawValue());
      }
    );
  }

  remove() {
    const id = this.fg.controls.resourceId.value!;
    const url = GlobalProperty.serverUrl() + `/api/system/webresource/${id}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<WebResourceFormData>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseObject<WebResourceFormData>) => {
        this.notifyService.changeMessage(model.message);
        this.formDeleted.emit(this.fg.getRawValue());
      }
    );
  }

  getCommonCodeList() {
    const url = GlobalProperty.serverUrl() + `/api/system/webresource/resourcetype`;
    const options = getHttpOptions();

    this.http.get<ResponseList<ResouceTypeEnum>>(url, options).pipe(
    ).subscribe(
      (model: ResponseList<ResouceTypeEnum>) => {
        this.resourceTypeList = model.data;
      }
    );

  }

}
