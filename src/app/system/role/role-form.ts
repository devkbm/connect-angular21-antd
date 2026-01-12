import { Component, OnInit, AfterViewInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';


import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { RoleFormValidatorService } from './validator/role-form-validator.service';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface RoleFormData {
  roleCode: string | null;
  roleName: string | null;
  description: string | null;
  menuGroupCode: string | null;
}

export interface MenuGroup {
  menuGroupCode: string | null;
  menuGroupName: string | null;
  menuGroupUrl: string | null;
  description: string | null;
  sequence: number | null;
}


@Component({
  selector: 'role-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}

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

      <div class="card-1">
        <nz-form-item>
          <nz-form-label nzFor="roleCode" nzRequired>롤 코드</nz-form-label>
          <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
            <input nz-input id="roleCode" formControlName="roleCode" required
              placeholder="롤 코드를 입력해주세요."/>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzFor="roleName" nzRequired>롤 명</nz-form-label>
          <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
            <input nz-input id="roleName" formControlName="roleName" required
              placeholder="롤 명을 입력해주세요."/>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzFor="menuGroupCode" nzRequired>메뉴그룹</nz-form-label>
          <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
            <nz-select nzId="menuGroupCode" formControlName="menuGroupCode">
                @for (option of menuGroupList; track option) {
                  <nz-option
                    [nzLabel]="option.menuGroupName"
                    [nzValue]="option.menuGroupCode">
                  </nz-option>
                }
              </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzFor="description">설명</nz-form-label>
          <nz-form-control>
            <textarea nz-input id="description" formControlName="description"
            placeholder="권한에 대한 설명을 입력해주세요." [rows]="10">
            </textarea>
          </nz-form-control>
        </nz-form-item>
      </div>
    </form>
  `,
  styles: [`
    .box {
        box-shadow:  0 6px 4px -4px rgba(0,0,0,0.7);
    }

    .box2 {
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }

    .card {
      border-radius: 2px;
      display: inline-block;
      height: 300px;
      margin: 1rem;
      position: relative;
      width: 300px;
    }

    .card-1 {
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .card-1:hover {
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

    .card-2 {
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }

    .card-3 {
      box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    }

    .card-4 {
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

    .card-5 {
      box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    }

    /* Shadows */
    .shadow-top {
        box-shadow: 0 -10px 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-right {
        box-shadow: 10px 0 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-bottom {
        box-shadow: 0 10px 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-left {
        box-shadow: -10px 0 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-all {
        box-shadow: 0 0 20px rgba(115,115,115,0.75);
    }
    .shadow-top-right{
        box-shadow: 0 -10px 20px -5px rgba(115,115,115,0.75),
                    10px 0 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-top-bottom{
        box-shadow: 0 -10px 20px -5px rgba(115,115,115,0.75),
                    0 10px 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-top-left{
        box-shadow: 0 -10px 20px -5px rgba(115,115,115,0.75),
                    -10px 0 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-bottom-right{
        box-shadow: 0 10px 20px -5px rgba(115,115,115,0.75),
                    10px 0 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-left-right{
        box-shadow: -10px 0 20px -5px rgba(115,115,115,0.75),
                    10px 0 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-bottom-left{
        box-shadow: 0 10px 20px -5px rgba(115,115,115,0.75),
                    -10px 0 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-top-bottom-right{
        box-shadow: 0 -10px 20px -5px rgba(115,115,115,0.75),
                    0 10px 20px -5px rgba(115,115,115,0.75),
                    10px 0 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-top-bottom-left{
        box-shadow: 0 -10px 20px -5px rgba(115,115,115,0.75),
                    0 10px 20px -5px rgba(115,115,115,0.75),
                    -10px 0 20px -5px rgba(115,115,115,0.75);
    }
    .shadow-inset {
        box-shadow: inset 0 0 20px rgba(115,115,115,0.75);
    }

  `]
})
export class RoleForm implements OnInit, AfterViewInit {

  //roleCode = viewChild.required<NzInputTextComponent>('roleCode');

  private http = inject(HttpClient);
  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private validator = inject(RoleFormValidatorService);

  menuGroupList: any;

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    roleCode : new FormControl<string | null>('', {
                                                    validators: Validators.required,
                                                    asyncValidators: [this.validator.existingEntityValidator()],
                                                    updateOn: 'blur'
                                                  }),
    roleName      : new FormControl<string | null>(null),
    description   : new FormControl<string | null>(null),
    menuGroupCode : new FormControl<string | null>(null)
  });

  formDataId = input<string>();

  constructor() {

    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()!);
      }
    })
  }

  ngOnInit() {
    this.getMenuGroupList();
  }

  ngAfterViewInit(): void {
    //this.roleCode().focus();
  }

  focusInput() {
    this.renderer.selectRootElement('#roleCode').focus();
  }

  newForm(): void {
    this.fg.reset();
    this.fg.controls.roleCode.setAsyncValidators(this.validator.existingEntityValidator());

    this.fg.controls.roleCode.enable();

    this.focusInput();
  }

  modifyForm(formData: RoleFormData): void {
    this.fg.controls.roleCode.setAsyncValidators(null);
    this.fg.controls.roleCode.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/system/role/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<RoleFormData>>(url, options)
        .pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<RoleFormData>) => {
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

    const url = GlobalProperty.serverUrl() + `/api/system/role`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<RoleFormData>>(url, this.fg.getRawValue(), options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('registerAuthority', undefined))
        )
        .subscribe(
          (model: ResponseObject<RoleFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/role/${this.fg.controls.roleCode.value}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<RoleFormData>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<RoleFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

  getMenuGroupList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<MenuGroup>>(url, options).pipe(
          //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            this.menuGroupList = model.data;
          }
        );

  }

}
