import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NzListModule } from 'ng-zorro-antd/list';
import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface Company {
  /**
   * 회사코드
   */
  companyCode: string | null;
  /**
   * 회사명
   */
  companyName: string | null;
  /**
   * 사업자등록번호
   */
  businessRegistrationNumber: string | null;
  /**
   * 법인번호
   */
  coporationNumber: string | null;
  /**
   * 대표자
   */
  nameOfRepresentative: string | null;
  /**
   * 설립일
   */
  establishmentDate: Date | null;
}

@Component({
  selector: 'company-list',
  imports: [
    CommonModule,
    NzListModule,
    NzIconModule
  ],
  template: `
    <ng-template #header>
      <nz-icon nzType="database" nzTheme="outline" />
      회사 목록
    </ng-template>

    <ng-template #footer>
        회사 : {{gridResource.value()?.data?.length}} 건
      </ng-template>

    <nz-list nzItemLayout="vertical" [nzHeader]="header" [nzFooter]="footer" >
      @for (item of gridResource.value()?.data; track item) {
        <nz-list-item nzNoFlex>
          <ng-container>
            <nz-list-item-meta>
              <nz-list-item-meta-title>
                {{item.companyName}} [ {{item.companyCode}} ]
              </nz-list-item-meta-title>

              <nz-list-item-meta-description>
                대표자 : {{item.nameOfRepresentative}}
              </nz-list-item-meta-description>
            </nz-list-item-meta>

            설립일 : {{item.establishmentDate}} <br/>
            사업자등록번호 : {{item.businessRegistrationNumber}} <br/>
            법인번호 : {{item.coporationNumber}} <br/>

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
export class CompanyList {
  editButtonClicked = output<Company>();

  private http = inject(HttpClient);

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<Company>>(
      GlobalProperty.serverUrl() + `/api/system/company`,
      getHttpOptions(params)
    )
  })

  onEditButtonClick(rowData: Company) {
    this.editButtonClicked.emit(rowData);
  }

}
