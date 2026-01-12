import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { catchError, of, switchMap } from 'rxjs';

import { SystemUserProfile, UserSessionService } from 'src/app/core/service/user-session.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    NzAvatarModule,
    NzIconModule,
    NzCardModule,
    NzModalModule,
    NzButtonModule,
    NzPopconfirmModule
  ],
  template: `
    <div class="card">
      <nz-card [nzBordered]="false" [nzActions]="[actionSetting, actionEdit, actionEllipsis]">
        <nz-card-meta
          [nzAvatar]="avatarTemplate"
          [nzTitle]="titleTemplate"
          [nzDescription]="descTemplate">
        </nz-card-meta>
      </nz-card>

      <ng-template #avatarTemplate>
        <nz-avatar class="avatar" [nzShape]="'square'" [nzSize]='48' [nzSrc]="profilePictureSrc"></nz-avatar>
      </ng-template>

      <ng-template #titleTemplate>
        {{profile?.staffName + '(' + profile?.userId + ')'}} <br/>
        {{profile?.session?.lastAccessedTime | date:"yyyy/MM/dd HH:mm:ss"}}
      </ng-template>

      <ng-template #descTemplate>
        {{profile?.deptName}}
      </ng-template>

      <ng-template #actionSetting>
        <nz-icon nzType="setting" />
      </ng-template>
      <ng-template #actionEdit>
        <nz-icon nzType="edit" (click)="test2()" />
      </ng-template>
      <ng-template #actionEllipsis>
        <!--
        <button
          nz-button
          nzType="text"
          nz-popconfirm
          nzPopconfirmTitle="로그아웃 하시겠습니까?"
          (nzOnConfirm)="logout()"
          (nzOnCancel)="false"
          nzPopconfirmPlacement="bottomRight"
          >
          <nz-icon nzType="logout"/>
        </button>
-->
        <nz-icon nzType="logout"
          nz-popconfirm
          nzPopconfirmTitle="로그아웃 하시겠습니까?"
          (nzOnConfirm)="logout()"
          (nzOnCancel)="false"
          nzPopconfirmPlacement="bottomRight"
          />
      </ng-template>

    </div>
  `,
  styles: [`
    .card {
      width: 300px;
      //height: 147px;
      height: calc(100% - 22px);
      background-color: green;
      border: 1px solid rgb(232, 232, 232);
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .card:hover {
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
  `]
})
export class UserProfile {

  profilePictureSrc: any;
  profile?: SystemUserProfile;

  private sessionService = inject(UserSessionService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private modal = inject(NzModalService);

  constructor() {
    this.profilePictureSrc = this.sessionService.getAvartarImageString();
    this.getMyInfo();
  }

  getMyInfo(): void {
    this.sessionService
        .getMyProfile()
        .subscribe(
            (model: ResponseObject<SystemUserProfile>) => {
              this.profile = model.data;
            }
        );
  }

  logoutConfirm() {
     this.modal.confirm({
      nzTitle: '로그 아웃하시겠습니까?',
      nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.logout(),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  logout() {
    const url1 = GlobalProperty.serverUrl() + `/api/system/user/auth1`;
    const url2 = GlobalProperty.serverUrl() + `/api/system/user/logout`;
    const options = getHttpOptions();

    this.http.get<any>(url1, options).pipe(
      switchMap(res => {
        //console.log(res.authenticated);
        if (res.authenticated) {
          return this.http.get<ResponseList<boolean>>(url2, options);
        } else {
          return of(false);
        }
      }),
      catchError((err) => { return of(false) })
    )
    .subscribe(logout => {
      this.router.navigate(['/login']);
    });
  }

  test2(): void {
    sessionStorage.setItem('selectedMenuGroup', 'ENV');
    sessionStorage.setItem('lastVisitUrl', '/profile/edit');

    this.router.navigate(['/profile/edit']);
  }

}
