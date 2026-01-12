import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface Word {
  logicalName: string | null;
  logicalNameEng: string | null;
  physicalName: string | null;
  comment: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class WordService extends DataService {

  constructor() {
    super('/api/system/word');
  }

  getList(): Observable<ResponseList<Word>> {
    const url = `${this.API_URL}`;
    const options = getHttpOptions();

    return this.http.get<ResponseList<Word>>(url, options).pipe(
      catchError(this.handleError<ResponseList<Word>>('getList', undefined))
    );
  }

  get(id: string): Observable<ResponseObject<Word>> {
    const url = `${this.API_URL}/${id}`;
    const options = getHttpOptions();

    return this.http.get<ResponseObject<Word>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<Word>>('get', undefined))
    );
  }

  save(term: Word): Observable<ResponseObject<Word>> {
    const url = `${this.API_URL}`;
    const options = getHttpOptions();

    return this.http.post<ResponseObject<Word>>(url, term, options).pipe(
      catchError(this.handleError<ResponseObject<Word>>('save', undefined))
    );
  }

  delete(id: string): Observable<ResponseObject<Word>> {
    const url = `${this.API_URL}/${id}`;
    const options = getHttpOptions();

    return this.http
              .delete<ResponseObject<Word>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<Word>>('delete', undefined))
              );
  }

}
