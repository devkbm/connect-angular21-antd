import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface TeamMemberModel {
  userId: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService extends DataService {

  constructor() {
      super('/grw');
  }

  public getAllMemberList(params?: any): Observable<ResponseList<TeamMemberModel>> {
    const url = `${this.API_URL}/allmember`;
    const options = getHttpOptions(params);

    return this.http
      .get<ResponseList<TeamMemberModel>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<TeamMemberModel>>('getAllMemberList', undefined))
      );
  }

}
