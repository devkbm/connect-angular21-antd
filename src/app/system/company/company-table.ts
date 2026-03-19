import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { ResponseList } from '@src/app/core/model/response-list';
import { GlobalProperty } from '@src/app/core/global-property';
import { getHttpOptions } from '@src/app/core/http/http-utils';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzListModule } from 'ng-zorro-antd/list';

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
  selector: 'company-table',
  imports: [
    CommonModule,
    NzListModule,
    NzTableModule,
    NzIconModule
  ],
  template: `
    <nz-table #basicTable [nzData]="gridResource.value()!.data">
      <thead>
        <tr>
          <th>회사코드</th>
          <th>회사명</th>
        </tr>
      </thead>
      <tbody>
        @for (data of gridResource.value()?.data; track data) {
          <tr>
            <td>{{ data.companyCode }}</td>
            <td>{{ data.companyName }}</td>
          </tr>
        }
      </tbody>
    </nz-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyTable {
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
