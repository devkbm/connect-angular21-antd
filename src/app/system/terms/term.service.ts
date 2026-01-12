import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { getHttpOptions } from 'src/app/core/http/http-utils';


export interface Term {
  termId: string | null;
  system: string | null;
  term: string | null;
  termEng: string | null;
  columnName: string | null;
  dataDomainId: string | null;
  domainName?: string | null;
  description: string | null;
  comment: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TermService extends DataService {

  constructor() {
    super('/api/system/terms');
  }

  getTermList(params?: any): Observable<ResponseList<Term>> {
    const url = `${this.API_URL}`;
    const options = getHttpOptions(params);

    return this.http.get<ResponseList<Term>>(url, options).pipe(
      catchError(this.handleError<ResponseList<Term>>('getTermList', undefined))
    );
  }

  get(id: string): Observable<ResponseObject<Term>> {
    const url = `${this.API_URL}/${id}`;
    const options = getHttpOptions();

    return this.http.get<ResponseObject<Term>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<Term>>('getTerm', undefined))
    );
  }

  save(term: Term): Observable<ResponseObject<Term>> {
    const url = `${this.API_URL}`;
    const options = getHttpOptions();

    console.log(url);
    return this.http.post<ResponseObject<Term>>(url, term, options).pipe(
      catchError(this.handleError<ResponseObject<Term>>('registerTerm', undefined))
    );
  }

  delete(id: string): Observable<ResponseObject<Term>> {
    const url = `${this.API_URL}/${id}`;
    const options = getHttpOptions();

    return this.http
              .delete<ResponseObject<Term>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<Term>>('deleteTerm', undefined))
              );
  }

  getSystemTypeList(): Observable<ResponseObject<any>> {
    const url = `${this.API_URL}/systemType`;
    const options = getHttpOptions();

    return this.http.get<ResponseObject<any>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<any>>('getSystemTypeList', undefined))
    );
  }
}
