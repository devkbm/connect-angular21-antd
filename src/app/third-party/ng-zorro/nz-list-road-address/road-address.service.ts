import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';

import { RoadAddressResult } from './road-address.model';

@Injectable({
  providedIn: 'root'
})
export class RoadAddressService extends DataService {

  constructor() {
    super('/api');
  }

  // RoadAddressResult
  get(keyword: string, currentPage: number, countPerPage: number): Observable<RoadAddressResult> {
    const url = `${this.API_URL}/address/sync`;
    const token = sessionStorage.getItem('token') as string;

    const options = {
      headers: new HttpHeaders()
                  //.set('Access-Control-Allow-Origin','http://localhost:4200')
                  //.set('Access-Control-Request-Method','GET')
                  .set('Content-Type', 'application/json')
                  .set('X-Requested-With', 'XMLHttpRequest')
                  .set('Authorization', token)
                  .set('x-auth-token', token),
      withCredentials: true,
      params: {
        keyword: keyword,
        currentPage: currentPage,
        countPerPage: countPerPage
      }
    };

    return this.http.get<RoadAddressResult>(url, options).pipe(
      catchError(this.handleError<RoadAddressResult>('get', undefined))
    );
  }

}
