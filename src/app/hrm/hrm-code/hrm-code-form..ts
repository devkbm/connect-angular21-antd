import { Component, OnInit, AfterViewInit, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';
import { FormlyFieldConfig } from '@ngx-formly/core';


import { HrmCodeFormValidatorService } from './validator/hrm-code-form-validator.service';
import { AutoFocusDirective } from 'src/app/core/form/auto-focus.directive';

export interface HrmCode {
  typeId: string | null;
  code: string | null;
  codeName: string | null;
  useYn: boolean | null;
  sequence: number | null;
  comment: string | null;
  fieldConfig: string | null;
  extraInfo: any;
}


@Component({
  selector: 'hrm-code-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzDividerModule,

    FormlyModule,
    FormlyNgZorroAntdModule
  ],
  template: `
    {{fg.getRawValue() | json}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <!-- ERROR TEMPLATE-->
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
        <div nz-col nzSpan="4">
          <nz-form-item>
            <nz-form-label nzFor="typeId" nzRequired>구분ID</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="typeId" formControlName="typeId" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item>
            <nz-form-label nzFor="code" nzRequired>코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="code" formControlName="code" required
                placeholder="코드를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="10">
          <nz-form-item>
            <nz-form-label nzFor="codeName" nzRequired>코드명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="codeName" formControlName="codeName" required
                placeholder="코드명를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item>
            <nz-form-label nzFor="sequence" nzRequired>출력 순번</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="sequence" formControlName="sequence" required
                [nzMin]="0" [nzMax]="9999"
              ></nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="2">
          <nz-form-item>
            <nz-form-label nzFor="useYn" nzRequired>사용</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <label nz-checkbox nzId="useYn" formControlName="useYn"></label>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="comment">설명</nz-form-label>
            <nz-form-control>
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="설명을 입력해주세요." [rows]="10">
              </textarea>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <formly-form [form]="this.fg.controls.extraInfo" [fields]="fields"></formly-form>

    </form>
  `,
  styles: []
})
export class HrmTypeCodeFormComponent implements OnInit, AfterViewInit {

  private notifyService = inject(NotifyService);
  private validator = inject(HrmCodeFormValidatorService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = this.fb.group({
    typeId        : new FormControl<string | null>({value: null, disabled: true}, { validators: Validators.required }),
    code          : new FormControl<string | null>(null, {
                                    validators: Validators.required,
                                    asyncValidators: [this.validator.existingEntityValidator()],
                                    updateOn: 'blur'
                                  }),
    codeName      : new FormControl<string | null>(null, { validators: Validators.required }),
    useYn         : new FormControl<boolean | null>(true),
    sequence      : new FormControl<number | null>(0),
    comment       : new FormControl<string | null>(null),
    extraInfo     : new FormGroup({})
  });

  fields: FormlyFieldConfig[] = [
    /*
    {
      key: 'the1AddInfo',
      type: 'input',
      props: {
        label: 'Input',
        placeholder: 'Placeholder',
        description: 'Description',
      },
    },
    */
  ];

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

  ngOnInit() {

  }

  ngAfterViewInit(): void {
  }

  newForm(typeId: string): void {
    this.getExtraFieldConfig(typeId);

    this.fg.controls.typeId.setValue(typeId);
    this.fg.controls.useYn.setValue(true);

    this.fg.controls.code.enable();
  }

  modifyForm(formData: HrmCode): void {
    console.log(formData);
    console.log(this.fg.controls);

    setTimeout(() => {
      /*
      this.fg.setValue({
        typeId: "HR0000",
        code: "A01",
        codeName: "입사",
        useYn: true,
        sequence: 1,
        comment: "11",
        extraInfo: {
            "th1AddInfo": "12",
            "th2AddInfo": "21"
        }
        });
      */
        this.fg.patchValue(formData);
    })

    this.fg.controls.code.disable();
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  select(param: any) {
    this.get(param.value['typeId'], param.value['code']);
  }

  get(typeId: string, code: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/hrmtype/${typeId}/code/${code}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<HrmCode>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<boolean>>('valid', undefined))
        )
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            this.fields = JSON.parse(model.data.fieldConfig!);

            if ( model.data ) {
              this.modifyForm(model.data);
            } else {
              this.newForm('');
            }

            //console.log(model.data.extraInfo);
            //console.log(this.fields);
          }
        )
  }

  save(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/hrmtype/type/code`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<HrmCode>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<HrmCode>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/hrmtype/${this.fg.controls.typeId.value}/code/${this.fg.controls.code.value}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<HrmCode>>(url, options).pipe(
          // catchError(this.handleError<ResponseObject<HrmCode>>('remove', undefined))
        )
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

  getExtraFieldConfig(typeId: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/hrmtype/${typeId}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<any>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<boolean>>('valid', undefined))
        )
        .subscribe(
          (model: ResponseObject<any>) => {
            console.log(model.data);
            this.fields = JSON.parse(model.data.fieldConfig!);
          }
        )
  }

}

