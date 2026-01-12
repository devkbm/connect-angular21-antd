import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemUserProfile, UserSessionService } from 'src/app/core/service/user-session.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';


@Component({
  selector: 'user-popup',
  imports: [
    CommonModule,
    NzCardModule,
    NzAvatarModule
  ],
  template: `
    <nz-card [nzBordered]="false">
      <nz-card-meta
        [nzAvatar]="avatarTemplate"
        [nzTitle]="titleTemplate"
        [nzDescription]="descTemplate">
      </nz-card-meta>
    </nz-card>
    <ng-template #avatarTemplate>
      <nz-avatar class="avatar" [nzShape]="'square'" [nzSize]='96' [nzSrc]="imgSrc"></nz-avatar>
    </ng-template>

    <ng-template #titleTemplate>
      {{profile?.staffName + '(' + profile?.userId + ')'}}
    </ng-template>

    <ng-template #descTemplate>
      {{profile?.deptName}}
    </ng-template>
  `,
  styles: [`
    .card-info {
      width: 300px;
      margin-top: 16px;
    }
  `]
})
export class UserPopup implements OnInit {

    /**
     * 아바타 이미지 경로
     */
    imgSrc: any;
    profile: SystemUserProfile | null = null;

    private sessionService = inject(UserSessionService);
    private modal = inject(NzModalRef);

    ngOnInit(): void {
        this.imgSrc = this.sessionService.getAvartarImageString();
        this.getMyInfo();
    }

    getMyInfo(): void {
      this.sessionService
          .getMyProfile()
          .subscribe(
              (model: ResponseObject<SystemUserProfile>) => {
                if ( model.data ) {
                  this.profile = model.data;
                }
                //this.notifyService.changeMessage(model.message);
              }
      );
    }

    destroyModal(): void {
      this.modal.destroy({ data: 'this the result data' });
    }

}
