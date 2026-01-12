import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface TeamModel {
  teamId: string | null;
  teamName: string | null;
  memberList: string[] | null;
}

export interface TeamJoinableUserModel {
  userId: string;
  userName: string;
}

export interface Team {
  teamId: string;
  teamName: string;
  memberList: string[];
}


@Injectable({
  providedIn: 'root'
})
export class TeamService extends DataService {

  constructor() {
    super('/api/grw/team');
  }

  /**
   * @description 팀명단을 조회한다.
   * @param params 조회 조건 객체
   */
  getList(params?: any): Observable<ResponseList<TeamModel>> {
    const url = `${this.API_URL}`;
    const options = getHttpOptions(params);

    return this.http
      .get<ResponseList<TeamModel>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<TeamModel>>('getTeamList', undefined))
      );
  }

  /**
   * @description 팀명단을 조회한다.
   * @param id 팀 id
   */
  get(id: string): Observable<ResponseObject<TeamModel>> {
    const url = `${this.API_URL}/${id}`;
    const options = getHttpOptions();

    return this.http
      .get<ResponseObject<TeamModel>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<TeamModel>>('getTeam', undefined))
      );
  }

  /**
   * @description 팀을 저장한다.
   * @param team team 객체
   */
  save(team: TeamModel): Observable<ResponseObject<TeamModel>> {
    const url = `${this.API_URL}`;
    const options = getHttpOptions();

    return this.http
      .post<ResponseObject<TeamModel>>(url, team, options)
      .pipe(
        catchError(this.handleError<ResponseObject<TeamModel>>('save', undefined))
      );

  }

  /**
   * @description 팀을 삭제한다.
   * @param id team 객체 id
   */
  remove(id: string): Observable<ResponseObject<TeamModel>> {
    const url = `${this.API_URL}/${id}`;
    const options = getHttpOptions();

    return this.http
      .delete<ResponseObject<TeamModel>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<TeamModel>>('remove', undefined))
      );
  }

  getAllUserList(): Observable<ResponseList<TeamJoinableUserModel>> {
    const url = `${this.API_URL}/allmember`;
    const options = getHttpOptions();

    return this.http
      .get<ResponseList<TeamJoinableUserModel>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<TeamJoinableUserModel>>('getAllUserList', undefined))
      );
  }

}

