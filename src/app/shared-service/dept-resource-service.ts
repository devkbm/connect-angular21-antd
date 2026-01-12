import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { Observable } from 'rxjs';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';

export interface DeptHierarchy {
  parentDeptCode: string;
  deptCode: string;
  deptNameKorean: string;
  deptAbbreviationKorean: string;
  deptNameEnglish: string;
  deptAbbreviationEnglish: string;
  fromDate: string;
  toDate: string;
  seq: number;
  comment: string;

  title: string;
  key: string;
  isLeaf: boolean;
  children: DeptHierarchy[];
}

@Injectable({
  providedIn: 'root',
})
export class DeptResourceService {

  private http = inject(HttpClient);

  params = signal<string>('001');
  resource = rxResource({
    params: () => this.params(),
    stream: ({params}) => this.http.get<ResponseList<DeptHierarchy>>(
      GlobalProperty.serverUrl() + `/api/system/depttree`,
      //getHttpOptions(params)
      getHttpOptions({company: params})
    )
  })

  getData(): DeptHierarchy[] | undefined {
    return this.resource.value()?.data;
  }

  getDeptHierarchy(companyCode: string): Observable<ResponseList<DeptHierarchy>> {
    const url = GlobalProperty.serverUrl() + `/api/system/depttree`;
    const options = getHttpOptions({company: companyCode});

    return this.http.get<ResponseList<DeptHierarchy>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Dept>>('saveDept', undefined))
        )
    }

}
