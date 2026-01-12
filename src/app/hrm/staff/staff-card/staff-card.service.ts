import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface StaffCardModel {
  staffId: string | null;
  staffNo: string | null;
  staffName: string | null;
  profilePicture: string | null;
  extensionNumber: string | null;
  mobileNumber: string | null;
  blngDeptName: string | null;
  workDeptName: string | null;
  jobPositionName: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class StaffCardService extends DataService {

  constructor() {
    super('/api/hrm/staff-card');
  }

  getList(): Observable<ResponseList<StaffCardModel>> {
    const url = `${this.API_URL}`;
    const options = getHttpOptions();

    return this.http.get<ResponseList<StaffCardModel>>(url, options).pipe(
      catchError(this.handleError<ResponseList<StaffCardModel>>('getList', undefined))
    );
  }

}
