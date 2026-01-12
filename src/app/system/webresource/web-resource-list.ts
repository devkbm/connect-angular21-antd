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


export interface WebResource {
  resourceId: string | null;
  resourceName: string | null;
  resourceType: string | null;
  url: string | null;
  description: string | null;
}


@Component({
  selector: 'web-resource-list',
  imports: [
    CommonModule,
    NzListModule,
    NzAvatarModule,
    NzIconModule
  ],
  template: `
    <ng-template #header>
      <nz-icon nzType="database" nzTheme="outline" />
      웹 리소스 목록
    </ng-template>

    <ng-template #footer>
      웹 리소스 : {{gridResource.value()?.data?.length}} 건
    </ng-template>

    <nz-list nzItemLayout="vertical" [nzHeader]="header" [nzFooter]="footer" >
      @for (item of gridResource.value()?.data; track item) {
        <nz-list-item>
          <ng-container>

            <nz-list-item-meta>
              <nz-list-item-meta-title>
                {{item.resourceName}} [ {{item.resourceId}} ]
              </nz-list-item-meta-title>

              <nz-list-item-meta-description>
                타입 : {{item.resourceType}}
              </nz-list-item-meta-description>
            </nz-list-item-meta>

            {{item.description}}

            <ul nz-list-item-actions>
              <nz-list-item-action>
                <a (click)="onEditButtonClick(item)"><nz-icon nzType="form" nzTheme="outline"/> edit</a>
              </nz-list-item-action>
            </ul>
          </ng-container>


          <nz-list-item-extra>
            @if (item.resourceType === 'IMAGE') {
              <img width="148" [src]="item.url" />
            } @else {
              {{item.resourceType}}
            }
          </nz-list-item-extra>

        </nz-list-item>
      }
    </nz-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebResourceList {

  editButtonClicked = output<WebResource>();

  private http = inject(HttpClient);

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<WebResource>>(
      GlobalProperty.serverUrl() + `/api/system/webresource`,
      getHttpOptions(params)
    )
  })

  onEditButtonClick(rowData: WebResource) {
    this.editButtonClicked.emit(rowData);
  }

}
