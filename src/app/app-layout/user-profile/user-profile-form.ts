import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { catchError, of, switchMap } from 'rxjs';

import { ResponseObject } from 'src/app/core/model/response-object';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';
import { SessionManager } from 'src/app/core/session-manager';

@Component({
  selector: 'app-user-profile-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzAvatarModule,
    NzIconModule,
    NzButtonModule,
],
  template: `
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

      {{this.fg.value |json}}

      <nz-form-item>
        <nz-form-label nzFor="userId" nzRequired>사용자ID</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="userId" formControlName="userId" required
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="beforePassword" nzRequired>기존 비밀번호</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="beforePassword" formControlName="beforePassword" required
            placeholder="기존 비밀번호를 입력해주세요."
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="afterPassword" nzRequired>변경 비밀번호</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="afterPassword" formControlName="afterPassword" required
            placeholder="변경 비밀번호를 입력해주세요."
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="afterPasswordConfirm" nzRequired>변경 비밀번호 확인</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="afterPasswordConfirm" formControlName="afterPasswordConfirm" required
            placeholder="변경 비밀번호를 한번 더 입력해주세요."
          />
        </nz-form-control>
      </nz-form-item>
    </form>

    <button nz-button nzType="primary" (click)="passwordChange()">
      <span nz-icon nzType="save" nzTheme="outline"></span>변경
    </button>
  `
})
export class UserProfileForm {

  private http = inject(HttpClient);

  fg = inject(FormBuilder).group({
    userId          : new FormControl<string | null>(null, { validators: [Validators.required] }),
    beforePassword  : new FormControl<string | null>(null, { validators: [Validators.required] }),
    afterPassword   : new FormControl<string | null>(null, { validators: [Validators.required] }),
    afterPasswordConfirm : new FormControl<string | null>(null, { validators: [Validators.required] }),
  });

  constructor() {
    this.fg.controls.userId.setValue(SessionManager.getUserId());
  }

  passwordChange() {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const val = {
      userId: this.fg.controls.userId.value,
      beforePassword: this.fg.controls.beforePassword.value,
      afterPassword: this.fg.controls.afterPassword.value
    }

    const url =  GlobalProperty.serverUrl() + `/api/system/user/${this.fg.controls.userId.value}/changepassword`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<boolean>>(url, val, options).pipe(
          //catchError(this.handleError<ResponseObject<BizCode>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<boolean>) => {

          }
        )
  }
}
