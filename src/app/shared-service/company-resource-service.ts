import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { Observable } from 'rxjs';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';

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

@Injectable({
  providedIn: 'root',
})
export class CompanyResourceService {

  private http = inject(HttpClient);

  params = signal<any>('');
  resource = rxResource({
    params: () => this.params(),
    stream: ({params}) => this.http.get<ResponseList<Company>>(
      GlobalProperty.serverUrl() + `/api/system/company`,
      getHttpOptions(params)
    )
  })

  getData(): Company[] | undefined {
    return this.resource.value()?.data;
  }

}
