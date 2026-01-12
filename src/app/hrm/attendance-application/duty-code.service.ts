import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { DutyCode } from './duty-code';
import { getHttpOptions } from 'src/app/core/http/http-utils';


@Injectable({
  providedIn: 'root'
})
export class DutyCodeService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  getDutyCodeList(params: any): Observable<ResponseList<DutyCode>> {
    const url = `${this.API_URL}/dutycode`;
    const options = getHttpOptions(params);

    return this.http.get<ResponseList<DutyCode>>(url, options).pipe(
      catchError(this.handleError<ResponseList<DutyCode>>('getDutyCodeList', undefined))
    );
  }

  getValidDutyCode(id: string): Observable<ResponseObject<boolean>> {
    const url = `${this.API_URL}/dutycode/${id}/valid`;
    const options = getHttpOptions();

    return this.http.get<ResponseObject<boolean>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<boolean>>('getValidDutyCode', undefined))
    );
  }

  /**
   * 근태코드정보를 조회한다.
   * @param id 근태코드
   */
  getDutyCode(id: string): Observable<ResponseObject<DutyCode>> {
    const url = `${this.API_URL}/dutycode/${id}`;
    const options = getHttpOptions();

    return this.http.get<ResponseObject<DutyCode>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<DutyCode>>('getDutyCode', undefined))
    );
  }

  /**
   * 근태코드정보를 저장한다.
   * @param dutyCode 근태코드정보
   */
  saveDutyCode(dutyCode: DutyCode): Observable<ResponseObject<DutyCode>> {
    const url = `${this.API_URL}/dutycode`;
    const options = getHttpOptions();

    return this.http.post<ResponseObject<DutyCode>>(url, dutyCode, options).pipe(
      catchError(this.handleError<ResponseObject<DutyCode>>('saveDutyCode', undefined))
    );
  }

  /**
   * 근태코드정보를 삭제한다.
   * @param id 근태코드
   */
  deleteDutyCode(id: string): Observable<ResponseObject<DutyCode>> {
    const url = `${this.API_URL}/dutycode/${id}`;
    const options = getHttpOptions();

    return this.http
              .delete<ResponseObject<DutyCode>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<DutyCode>>('deleteDutyCode', undefined))
              );
  }

}
