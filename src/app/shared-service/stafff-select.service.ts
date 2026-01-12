import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { getHttpOptions } from 'src/app/core/http/http-utils';
import { GlobalProperty } from 'src/app/core/global-property';
import { ResponseList } from 'src/app/core/model/response-list';

export interface Staff {
    staffId: string;
    companyCode: string;
    staffNo: string;
    name: string;
    nameEng: string;
    nameChi: string;
    residentRegistrationNumber: string;
    gender: string;
    birthday: Date;
    imagePath: string;

    [key:string]:any;
  }


@Injectable({
  providedIn: 'root'
})
export class StaffSelectService {

  private http = inject(HttpClient);
  list: Staff[] = [];

  getStaffList(): void {
    const params = {isEnabled: true};

    const url = GlobalProperty.serverUrl() + `/api/hrm/staff`;
    const options = getHttpOptions({isEnabled: true});

    this.http.get<ResponseList<Staff>>(url, options).pipe(
          //catchError(this.handleError<ResponseList<Staff>>('getList', undefined))
        )
        .subscribe(
          (model: ResponseList<Staff>) => {
            this.list = model.data;
          }
        );
  }

}
