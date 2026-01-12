import { Component, OnInit, AfterViewInit, inject, Renderer2, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { NotifyService } from 'src/app/core/service/notify.service';

import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { DeptFormValidatorService } from './validator/dept-form-validator.service';

export interface DeptFormData {
  parentDeptCode: string | null;
  //deptId: string | null;
  deptCode: string | null;
  deptNameKorean: string | null;
  deptAbbreviationKorean: string | null;
  deptNameEnglish: string | null;
  deptAbbreviationEnglish: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  seq: number | null;
  comment: string | null;
}

export interface DeptHierarchy {
  parentDeptCode: string;
  deptCode: string;
  deptNameKorean: string;
  deptAbbreviationKorean: string;
  deptNameEnglish: string;
  deptAbbreviationEnglish: string;
  fromDate: string;
  toDate: string;
  seq: number;
  comment: string;

  title: string;
  key: string;
  isLeaf: boolean;
  children: DeptHierarchy[];
}


@Component({
  selector: 'dept-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzTreeSelectModule,
    NzDatePickerModule,
],
  template: `
    <!--{{fg.getRawValue()| json}} - {{fg.valid}}-->
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

        <div nz-col nzSpan="12">
          <nz-form-item class="form-item">
            <nz-form-label
                nzFor="parentDeptCode">
                상위 부서코드
            </nz-form-label>

            <nz-form-control>
                <nz-tree-select
                    id="parentDeptCode"
                    [nzNodes]="deptHierarchy"
                    [nzAllowClear]="true"
                    [nzPlaceHolder]="'상위 부서 없음'"
                    formControlName="parentDeptCode">
                </nz-tree-select>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="deptCode" nzRequired>부서코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="deptCode" formControlName="deptCode" required
                placeholder="부서코드를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="deptNameKorean" nzRequired>부서코드명(한글)</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="deptNameKorean" formControlName="deptNameKorean" required
                placeholder="부서코드명(한글)을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="deptAbbreviationKorean">부서코드명(한글) 약어</nz-form-label>
            <nz-form-control>
              <input nz-input id="deptAbbreviationKorean" formControlName="deptAbbreviationKorean"
                placeholder="부서코드명(한글) 약어를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="deptNameEnglish" nzRequired>부서코드명(영문)</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="deptNameEnglish" formControlName="deptNameEnglish" required
                placeholder="부서코드명(영문)을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="deptAbbreviationEnglish">부서코드명(영문) 약어</nz-form-label>
            <nz-form-control>
              <input nz-input id="deptAbbreviationEnglish" formControlName="deptAbbreviationEnglish"
                placeholder="부서코드명(영문) 약어를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <!-- 4 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="fromDate" nzRequired>시작일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="fromDate" formControlName="fromDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="toDate" nzRequired>종료일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="toDate" formControlName="toDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="seq" nzRequired>출력 순번</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="seq" formControlName="seq" required
                [nzMin]="0" [nzMax]="9999">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <!-- 5 row -->
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

    </form>

    <!--<div class="footer">
        <button
            nz-button
            (click)="closeForm()">
            <span nz-icon type="form" nzTheme="outline"></span>
            닫기
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button
            nz-button
            nzType="primary"
            nz-popconfirm
            nzTitle="저장하시겠습니까?"
            (nzOnConfirm)="submitCommonCode()"
            (nzOnCancel)="false">
            <span nz-icon type="save" nzTheme="outline"></span>
            저장
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button
            nz-button
            nzDanger
            nz-popconfirm
            nzTitle="삭제하시겠습니까?"
            (nzOnConfirm)="deleteCommonCode()"
            (nzOnCancel)="false">
            <span nz-icon type="delete" nzTheme="outline"></span>
            삭제
        </button>

    </div>
    -->

  `,
  styles: [`
    [nz-form] {
      margin: 10px;
    }

    [nz-button] {
      margin-right: 8px;
    }

    .btn-group {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
    }

    .footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
    }


  `]
})
export class DeptForm implements OnInit, AfterViewInit {

  //deptCode = viewChild.required<NzInputTextComponent>('deptCode');

  deptHierarchy: DeptHierarchy[] = [];

  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);
  private validator = inject(DeptFormValidatorService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    parentDeptCode          : new FormControl<string | null>(null),
    deptCode                : new FormControl<string | null>(null, {
                                validators: Validators.required,
                                asyncValidators: [this.validator.existingEntityValidator()],
                                updateOn: 'blur'
                              }),
    deptNameKorean          : new FormControl<string | null>(null, { validators: [Validators.required] }),
    deptAbbreviationKorean  : new FormControl<string | null>(null),
    deptNameEnglish         : new FormControl<string | null>(null, { validators: [Validators.required] }),
    deptAbbreviationEnglish : new FormControl<string | null>(null),
    fromDate                : new FormControl<Date | null>(null, { validators: [Validators.required] }),
    toDate                  : new FormControl<Date | null>(null, { validators: [Validators.required] }),
    seq                     : new FormControl<number | null>(1, { validators: [Validators.required] }),
    comment                 : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.getDeptHierarchy();
    this.newForm();
  }

  ngAfterViewInit(): void {
    //this.deptCode().focus();
  }

  focusInput() {
    //this.renderer.selectRootElement('#deptCode').focus();
  }

  newForm(): void {

    this.fg.reset();
    //this.fg.controls.deptId.setAsyncValidators(existingDeptValidator(this.service));
    this.fg.controls.deptCode.enable();

    this.fg.controls.deptCode.valueChanges.subscribe(value => {
      if (value === null) return;
      const companyCode = sessionStorage.getItem('companyCode');
      //this.fg.controls.deptId.setValue(companyCode + value);
    });

    /*
    this.fg.patchValue({
      fromDate: dateFns.format(new Date(), "yyyy-MM-dd"),
      toDate: dateFns.format(new Date(9999,11,31), "yyyy-MM-dd"),
      seq: 1
    });
    */

    this.focusInput();
  }

  modifyForm(formData: DeptFormData): void {
    this.getDeptHierarchy();

    //this.fg.get('deptId')?.setAsyncValidators(null);
    this.fg.controls.deptCode.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/system/dept/${id}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<DeptFormData>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Dept>>('getDept', undefined))
        )
        .subscribe(
          (model: ResponseObject<DeptFormData>) => {
            if ( model.data ) {
              this.modifyForm(model.data);
            } else {
              this.getDeptHierarchy();
              this.newForm();
            }
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

    const url = GlobalProperty.serverUrl() + `/api/system/dept`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<DeptFormData>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<Dept>>('saveDept', undefined))
        )
        .subscribe(
          (model: ResponseObject<DeptFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/dept/${this.fg.controls.deptCode.value!}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<DeptFormData>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Dept>>('saveDept', undefined))
        )
        .subscribe(
          (model: ResponseObject<DeptFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  getDeptHierarchy(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/depttree`;
    const options = getHttpOptions();

    this.http.get<ResponseList<DeptHierarchy>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Dept>>('saveDept', undefined))
        )
        .subscribe(
          (model: ResponseList<DeptHierarchy>) => {
            model.data ? this.deptHierarchy = model.data : this.deptHierarchy = [];
          }
        )

  }

}
