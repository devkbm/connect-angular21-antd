import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GlobalProperty } from 'src/app/core/global-property';
import { UnauthorizedError } from '../error/unauthorized-error';

export class DataService {

  protected responseMap =  (res: Response) => res;
  protected serverUrl;
  protected API_URL;

  protected http = inject(HttpClient);
  protected tokenExtractor = inject(HttpXsrfTokenExtractor);

  constructor(protected API_URI: string) {
    this.serverUrl = GlobalProperty.serverUrl();
    this.API_URL = this.serverUrl + API_URI;
  }

  /**
   * @description HttpHeaders를 가져온다.
   * @returnType {HttpHeaders}
   */
  protected getHttpHeaders(): HttpHeaders {
    const token = this.tokenExtractor.getToken() as string;

    return new HttpHeaders()
        //.set('X-XSRF-TOKEN', token)
        .set('Content-Type', 'application/json');
  }

  /**
   * @description 로그인 후 인증된 HttpHeaders를 가져온다.
   * @returnType {HttpHeaders}
   */
  protected getAuthorizedHttpHeaders(): HttpHeaders {
    //const token = this.tokenExtractor.getToken() as string;

    const token = sessionStorage.getItem('token') as string;

    return new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('X-Requested-With', 'XMLHttpRequest')
        //.set('X-XSRF-TOKEN', token)
        .set('Authorization', token)
        .set('x-auth-token', token);
  }

  protected getAuthorizedMultiPartHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') as string;

    const headers = new HttpHeaders()
    //.set('Content-Type', 'multipart/form-data')
    .set('Accept', 'application/json')
    .set('Authorization', token)
    .set('X-Auth-Token', token);

    headers.delete('Content-Type');

    return  headers;
  }

  protected getAuthorizedHeaders(): Headers {
    const token = sessionStorage.getItem('token') as string;

    return new Headers({'X-Auth-Token': token});
  }

  /**
   * HTTP 요청이 실패한 경우를 처리합니다.
   * 애플리케이션 로직 흐름은 그대로 유지됩니다.
   * @param operation - 실패한 동작의 이름
   * @param result - 기본값으로 반환할 객체
   */
  protected handleError<T>(operation = 'operation', result?: T) {
      return (error: HttpErrorResponse): Observable<T> => {

      // TODO: 리모트 서버로 에러 메시지 보내기
      // console.error(error); // 지금은 콘솔에 로그를 출력합니다.

      // TODO: 사용자가 이해할 수 있는 형태로 변환하기
      // this.log(`${operation} failed: ${error.message}`);

      if (error.status === 401) {
        window.location.href = '/login';
      }

      if (error instanceof UnauthorizedError) {
        console.log('로그인 필요함');
      }

      // 애플리케이션 로직이 끊기지 않도록 기본값으로 받은 객체를 반환합니다.
      return of(result as T);
      };
  }
}
