import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { MenuGroupFormValidatorService } from './validator/menu-group-form-validator.service';

export interface MenuGroupFormData {
  menuGroupCode: string | null;
  menuGroupName: string | null;
  menuGroupUrl: string | null;
  description: string | null;
  sequence: number | null;
}


@Component({
  selector: 'menu-group-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,

],
  template: `
    {{fg.value | json}}
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

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="menuGroupCode" nzRequired>메뉴그룹코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuGroupCode" formControlName="menuGroupCode" placeholder="메뉴그룹코드를 입력해주세요." />
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="menuGroupName" nzRequired>메뉴그룹명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuGroupName" formControlName="menuGroupName" placeholder="메뉴그룹명을 입력해주세요." />
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="menuGroupUrl" nzRequired>메뉴그룹URL</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuGroupUrl" formControlName="menuGroupUrl" placeholder="메뉴그룹URL을 입력해주세요." />
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="sequence">순번</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="sequence" formControlName="sequence" placeholder="순번을 입력해주세요." />
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="description">비고</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="description" formControlName="description"
              placeholder="비고" [rows]="10">
              </textarea>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class MenuGroupForm implements OnInit, AfterViewInit {

  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);
  private validator = inject(MenuGroupFormValidatorService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    menuGroupCode   : new FormControl<string | null>(null, {
      validators: Validators.required ,
      asyncValidators: [this.validator.existingEntityValidator()],
      updateOn: 'blur'
    }),
    menuGroupName   : new FormControl<string | null>(null, { validators: Validators.required }),
    menuGroupUrl    : new FormControl<string | null>(null, { validators: Validators.required }),
    description     : new FormControl<string | null>(null),
    sequence        : new FormControl<number | null>(null),
  });

  formDataId = input<string>();

  constructor() {

    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()!);
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  focusInput() {
    this.renderer.selectRootElement('#menuGroupCode').focus();
  }

  newForm(): void {
    this.fg.reset();

    this.fg.controls.menuGroupCode.enable();
    this.focusInput();
  }

  modifyForm(formData: MenuGroupFormData): void {
    this.fg.controls.menuGroupCode.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(menuGroupCode: string) {
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup/${menuGroupCode}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<MenuGroupFormData>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<MenuGroupFormData>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
          }
        )
  }

  save() {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const url = GlobalProperty.serverUrl() + `/api/system/menugroup/${this.fg.controls.menuGroupCode}`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<MenuGroupFormData>>(url, this.fg.getRawValue(), options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<MenuGroupFormData>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )
  }

  remove() {
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup/${this.fg.controls.menuGroupCode.value}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<MenuGroupFormData>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<MenuGroupFormData>) => {
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

}
