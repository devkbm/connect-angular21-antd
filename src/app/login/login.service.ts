import { Injectable } from '@angular/core';

import { DataService } from '../core/service/data.service';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { getHttpOptions } from '../core/http/http-utils';
import { GlobalProperty } from '../core/global-property';
import { UserToken } from '../core/session-manager';


@Injectable({
  providedIn: 'root'
})
export class LoginService extends DataService {

  constructor() {
    super('/api/system/user/login');
  }

  /**
   * @description 로그인 한다.
   * @paramTag 아이디
   * @paramTag 비밀번호
   * @returnType {UserToken} Token 정보
   */
  doLogin(companyCode: string, staffNo: string, pwd: string): Observable<UserToken> {
    const body = {companyCode: companyCode, staffNo: staffNo, password: pwd};
    const options = {
      headers: this.getHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .post<UserToken>(this.API_URL, body, options).pipe(
        // tap((userToken: UserToken) => console.log(userToken.token) ),
        // catchError((err) => Observable.throw(err))
      );
  }

  private doJsonLogin(id: string, pwd: string): Observable<UserToken> {
    const body = {username: id, password: pwd};
    const options = {
      headers: this.getHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .post<UserToken>(this.API_URL, body, options).pipe(
        // tap((userToken: UserToken) => console.log(userToken.token) ),
        // catchError((err) => Observable.throw(err))
      );
  }

  private doFormLogin(id: string, pwd: string): Observable<UserToken> {
    const body = {username: id, password: pwd};
    const options = {}; /* {
      headers: this.getHttpHeaders()
    };*/


    let form = new FormData();
    form.set('username', id);
    form.set('password', pwd);

    return this.http
      .post<UserToken>(this.API_URL, form, options).pipe(
        // tap((userToken: UserToken) => console.log(userToken.token) ),
        // catchError((err) => Observable.throw(err))
      );
  }

  getAuthToken(companyCode: string): Observable<UserToken> {
    const url = GlobalProperty.serverUrl() + '/api/system/user/auth?companyCode='+companyCode;

    const options = getHttpOptions();

    return this.http.get<UserToken>(url, options).pipe(
      catchError(this.handleError<UserToken>('getAuthToken', undefined))
    );
  }

  getOAuth2Token(companyCode: string): Observable<UserToken> {
    const url = GlobalProperty.serverUrl() + '/api/system/user/oauth2?companyCode='+companyCode;

    const options = getHttpOptions();

    return this.http.get<UserToken>(url, options).pipe(
      catchError(this.handleError<UserToken>('getAuthToken', undefined))
    );
  }

}
