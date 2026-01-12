import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NzListModule } from 'ng-zorro-antd/list';
import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { NzIconModule } from 'ng-zorro-antd/icon';


export interface Role {
  roleCode: string | null;
  roleName: string | null;
  description: string | null;
  menuGroupCode: string | null;
}

@Component({
  selector: 'role-list',
  imports: [
    CommonModule,
    NzListModule,
    NzIconModule
  ],
  template: `
    <ng-template #header>
      <nz-icon nzType="database" nzTheme="outline" />
      롤 목록
    </ng-template>

    <ng-template #footer>
        롤 : {{gridResource.value()?.data?.length}} 건
      </ng-template>

    <nz-list nzItemLayout="vertical" [nzHeader]="header" [nzFooter]="footer" >
      @for (item of gridResource.value()?.data; track item) {
        <nz-list-item nzNoFlex>
          <ng-container>
            <nz-list-item-meta>
              <nz-list-item-meta-title>
                {{item.roleName}} [ {{item.roleCode}} ]
              </nz-list-item-meta-title>

              <nz-list-item-meta-description>
                메뉴그룹코드 : {{item.menuGroupCode}}
              </nz-list-item-meta-description>
            </nz-list-item-meta>

            비고 : {{item.description}}

            <ul nz-list-item-actions>
              <nz-list-item-action>
                <a (click)="onEditButtonClick(item)"><nz-icon nzType="form" nzTheme="outline"/> edit</a>
              </nz-list-item-action>
            </ul>
          </ng-container>
        </nz-list-item>
      }
    </nz-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleList {

  editButtonClicked = output<Role>();

  private http = inject(HttpClient);

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<Role>>(
      GlobalProperty.serverUrl() + `/api/system/role`,
      getHttpOptions(params)
    )
  })

    onEditButtonClick(rowData: Role) {
      this.editButtonClicked.emit(rowData);
    }
}
