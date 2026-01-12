import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { NzIconModule } from 'ng-zorro-antd/icon';


export interface User {
  userId: string | null;
  companyCode: string | null;
  staffNo: string | null;
  name: string | null;
  deptCode: string | null;
  deptName: string | null;
  mobileNum: string | null;
  email: string | null;
  imageBase64: string | null;
  enabled: boolean | null;
  roleList: string | null;
  menuGroupList: string | null;
}

@Component({
  selector: 'user-list',
  imports: [
    CommonModule,
    NzListModule,
    NzAvatarModule,
    NzIconModule
  ],
  template: `
    <ng-template #header>
      <nz-icon nzType="database" nzTheme="outline" />
      사용자 목록
    </ng-template>

    <ng-template #footer>
      사용자 : {{gridResource.value()?.data?.length}} 건
    </ng-template>

    <nz-list nzItemLayout="vertical" [nzHeader]="header" [nzFooter]="footer" >
      @for (item of gridResource.value()?.data; track item) {
        <nz-list-item>
          <ng-container>

            <nz-list-item-meta>
              @if (item.imageBase64) {
                <nz-list-item-meta-avatar [nzSrc]="imageUrl(item)">
                </nz-list-item-meta-avatar>
              } @else {
                <nz-list-item-meta-avatar>
                  <nz-avatar nzIcon="user"></nz-avatar>
                </nz-list-item-meta-avatar>
              }

              <nz-list-item-meta-title>
                {{item.name}} [ {{item.staffNo}} ] - 부서 : {{item.deptName}}
              </nz-list-item-meta-title>
              <!--
              <nz-list-item-meta-description>
                부서 : {{item.deptName}}
              </nz-list-item-meta-description>
            -->
            </nz-list-item-meta>

            핸드폰 번호 : {{item.mobileNum}} <br/>
            이메일 : {{item.email}}

            <ul nz-list-item-actions>
              <nz-list-item-action>
                <a (click)="onEditButtonClick(item)"><nz-icon nzType="form" nzTheme="outline"/> edit</a>
              </nz-list-item-action>
            </ul>
          </ng-container>

           <nz-list-item-extra style="width: 30%">
            &#10003; 롤 <br/>
            {{item.roleList}} <br/>
            &#10003; 메뉴그룹 <br/>
            {{item.menuGroupList}}
          </nz-list-item-extra>
        </nz-list-item>
      }
    </nz-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {

  editButtonClicked = output<User>();

  private http = inject(HttpClient);

  msg = inject(NzMessageService);

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<User>>(
      GlobalProperty.serverUrl() + `/api/system/user`,
      getHttpOptions(params)
    )
  })

  onEditButtonClick(rowData: User) {
    this.editButtonClicked.emit(rowData);
  }

  imageUrl(rowData: User) {
    if (rowData.imageBase64 === null) return '';

    let urlParams = new URLSearchParams();
    urlParams.set("companyCode", rowData.companyCode!);
    urlParams.set("userId", rowData.userId!);

    return GlobalProperty.serverUrl() + '/api/system/user/image' + '?' + urlParams;
  }

}
