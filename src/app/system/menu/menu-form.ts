import { Component, OnInit, AfterViewInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { MenuFormValidatorService } from './validator/menu-form-validator.service';

import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface MenuGroup {
  menuGroupCode: string | null;
  menuGroupName: string | null;
  menuGroupUrl: string | null;
  description: string | null;
  sequence: number | null;
}

export interface MenuHierarchy {
  createdDt: Date;
  createdBy: string;
  modifiedDt: Date;
  modifiedBy: string;
  key: string;
  title: string;
  menuGroupId: string;
  menuId: string;
  menuName: string;
  parentMenuId: string;
  menuType: string;
  sequence: number;
  level: number;
  url: string;
  selected: boolean;
  expanded: boolean;
  children: MenuHierarchy[]
}

export interface MenuFormData {
  menuGroupCode: string | null;
  menuCode: string | null;
  menuName: string | null;
  menuType: string | null;
  parentMenuCode: string | null;
  sequence: number | null;
  appUrl: string | null;
  appIconType: string | null;
  appIcon: string | null;
}

@Component({
  selector: 'menu-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzTreeSelectModule,
    NzSelectModule,
  ],
  template: `
    {{fg.getRawValue() | json}}
    {{fg.valid}}
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

      <!-- 1 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="menuGroupCode" nzRequired>메뉴그룹코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="menuGroupCode" formControlName="menuGroupCode" (ngModelChange)="selectMenuGroup($event)">
                @for (option of menuGroupList; track option) {
                  <nz-option
                    [nzLabel]="option.menuGroupName"
                    [nzValue]="option.menuGroupCode">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="parentMenuCode" nzRequired>상위 메뉴</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-tree-select
                nzId="parentMenuCode"
                formControlName="parentMenuCode"
                [nzNodes]="menuHiererachy"
                nzPlaceHolder="상위 메뉴 없음"
                >
              </nz-tree-select>

            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="menuCode" nzRequired>메뉴코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuCode" formControlName="menuCode" required
                placeholder="메뉴코드를 입력해주세요."
              />
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="menuName" nzRequired>메뉴명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuName" formControlName="menuName" required
                placeholder="메뉴명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="menuType" nzRequired>메뉴타입</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="menuType" formControlName="menuType">
                @for (option of menuTypeList; track option) {
                  <nz-option
                    [nzLabel]="option.label"
                    [nzValue]="option.value">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="sequence" nzRequired>순번</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="sequence" formControlName="sequence" required
                [nzMin]="0" [nzMax]="9999" placeholder="순번을 입력해주세요.">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="appUrl" nzRequired>APP URL</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="appUrl" formControlName="appUrl" required
                placeholder="URL을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="appIconType" nzRequired>APP ICON TYPE</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="appIconType" formControlName="appIconType">
                @for (option of appIconTypeList; track option) {
                  <nz-option
                    [nzLabel]="option.label"
                    [nzValue]="option.value">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="appIcon" nzRequired>APP ICON</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
            @if (this.fg.controls.appIconType.value === 'RESOURCE') {
              <nz-select nzId="appIcon" formControlName="appIcon">
                @for (option of resourceList; track option) {
                  <nz-option
                    [nzLabel]="option.resourceName"
                    [nzValue]="option.resourceId">
                  </nz-option>
                }
              </nz-select>
            } @else {
              <input nz-input id="appIcon" formControlName="appIcon" required
                placeholder="ICON을 입력해주세요."/>
            }
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class MenuForm implements OnInit, AfterViewInit {

  appIconTypeList :{value: string, label: string}[] = [
    {value: 'NZ_ICON', label: 'NZ ICON'},
    {value: 'RESOURCE', label: 'RESOURCE'}
  ];

  resourceList: any;

  /**
   * 상위 메뉴 트리
   */
  menuHiererachy: MenuHierarchy[] = [];
  menuGroupList: any;
  menuTypeList: any;

  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);
  private validator = inject(MenuFormValidatorService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
      menuGroupCode       : new FormControl<string | null>(null, { validators: Validators.required }),
      menuCode            : new FormControl<string | null>(null, {
        validators: Validators.required,
        asyncValidators: [this.validator.existingEntityValidator()],
        updateOn: 'blur'
      }),
      menuName          : new FormControl<string | null>(null, { validators: Validators.required }),
      menuType          : new FormControl<string | null>(null, { validators: Validators.required }),
      parentMenuCode    : new FormControl<string | null>(null),
      sequence          : new FormControl<number | null>(null),
      appUrl            : new FormControl<string | null>(null, { validators: Validators.required }),
      appIconType       : new FormControl<string | null>(null),
      appIcon           : new FormControl<string | null>(null)
  });

  formDataId = input<{menuGroupCode: string, menuCode: string}>();

  constructor() {

    effect(() => {
      if (this.formDataId()) {
        if (this.formDataId()?.menuGroupCode && this.formDataId()?.menuCode) {
          this.get(this.formDataId()?.menuGroupCode!, this.formDataId()?.menuCode!);
        } else if (this.formDataId()?.menuGroupCode && !this.formDataId()?.menuCode) {
          this.newForm(this.formDataId()?.menuGroupCode!);
        }
      }
    });
  }

  ngOnInit() {
    this.getMenuTypeList();
    this.getMenuGroupList();
    this.getResourceList();
  }

  ngAfterViewInit(): void {

  }

  focusInput() {
    this.renderer.selectRootElement('#menuCode').focus();
  }

  newForm(menuGroupCode: string): void {

    this.getMenuHierarchy(menuGroupCode);

    this.fg.controls.menuGroupCode.setValue(menuGroupCode);
    //this.fg.controls.menuCode.disable();

    this.focusInput();
  }

  modifyForm(formData: MenuFormData): void {

    console.log(formData.menuGroupCode!);
    this.getMenuHierarchy(formData.menuGroupCode!);
    this.fg.controls.menuCode.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(menuGroupCode: string, menuCode: string) {
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup/${menuGroupCode}/menu/${menuCode}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<MenuFormData>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<MenuFormData>) => {
            if ( model.data ) {
              this.modifyForm(model.data);
            } else {
              this.newForm(menuGroupCode);
            }
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

    const menuGroupCode = this.fg.controls.menuGroupCode.value;
    const menuCode = this.fg.controls.menuCode.value;
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup/${menuGroupCode}/menu/${menuCode}`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<MenuFormData>>(url, this.fg.getRawValue(), options).pipe(
          //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<MenuFormData>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )

  }

  remove(): void {
    const menuGroupCode = this.fg.controls.menuGroupCode.value;
    const menuCode = this.fg.controls.menuCode.value;
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup/${menuGroupCode}/menu/${menuCode}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<MenuFormData>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<MenuFormData>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )

  }

  getMenuHierarchy(menuGroupId: string): void {
    if (!menuGroupId) return;

    const url = GlobalProperty.serverUrl() + `/api/system/menuhierarchy/${menuGroupId}`;
    const options = getHttpOptions();
    console.log(menuGroupId);
    this.http
        .get<ResponseList<MenuHierarchy>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseList<MenuHierarchy>) => {
            this.menuHiererachy = model.data;
          }
        )
  }

  getMenuGroupList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<MenuGroup>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            this.menuGroupList = model.data;
          }
        )

  }

  getMenuTypeList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/menu/menutype`;
    const options = getHttpOptions();

    this.http
    .get<ResponseObject<any>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            this.menuTypeList = model.data;
          }
        )

  }

  getResourceList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/webresource`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<any>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseObject<any>) => {
        this.resourceList = model.data;
      }
    );
  }

  selectMenuGroup(menuGroupId: any): void {
    if (!menuGroupId) return;

    this.getMenuHierarchy(menuGroupId);
  }

}
