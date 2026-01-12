import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GlobalProperty } from '../core/global-property';
import { getHttpOptions } from '../core/http/http-utils';
import { ResponseList } from '../core/model/response-list';

export interface User {
  userId: string | null;
  companyCode: string | null;
  staffNo: string | null;
  password?: string | null;
  name: string | null;
  deptCode: string | null;
  mobileNum: string | null;
  email: string | null;
  imageBase64: string | null;
  enabled: boolean | null;
  roleList: string[] | null;
}

@Injectable({
  providedIn: 'root',
})
export class SystemUserQueryService {

  http = inject(HttpClient);

  getUserList(params: any): Observable<ResponseList<User>> {
    const url = GlobalProperty.serverUrl() + `/api/system/user`;
    const options = getHttpOptions(params);

    return this.http.get<ResponseList<User>>(url, options).pipe(
      //catchError(this.handleError<ResponseMap<HrmCode>>('getMapList', undefined))
    );
  }

}
