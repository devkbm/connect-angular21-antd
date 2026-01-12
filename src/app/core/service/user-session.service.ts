import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { ResponseObject } from '../model/response-object';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from '../http/http-utils';

export interface SystemUserProfile {
  companyCode: string;
	userId: string;
	staffNo: string;
	staffName: string;
	deptCode: string;
	deptName: string;
	mobileNum: string;
	email: string;
  session : {
    ipAddress: string;
    lastAccessedTime: string;
  }
}


@Injectable({
  providedIn: 'root'
})
export class UserSessionService extends DataService {
  private IMAGE_URI = '/api/system/user/image';

  constructor() {
    super('/api/system/user');
    this.IMAGE_URI = GlobalProperty.serverUrl() + '/api/system/user/image';
  }

  getAvartarImageString(): string | null {
    const imageUrl = sessionStorage.getItem('imageUrl');
    if (imageUrl === 'null') return null;

    //return this.IMAGE_URI + sessionStorage.getItem('imageUrl');

    let urlParams = new URLSearchParams();
    urlParams.set("companyCode", sessionStorage.getItem("companyCode")!);
    urlParams.set("userId", sessionStorage.getItem("userId")!);
    return this.IMAGE_URI + '?' + urlParams;
  }

  getMyProfile(): Observable<ResponseObject<SystemUserProfile>> {
    const url = `${this.API_URL}/my-profile`;
    const options = getHttpOptions();

    return this.http
      .get<ResponseObject<SystemUserProfile>>(url, options).pipe(
        //catchError((err) => Observable.throw(err))
      );
  }
}
