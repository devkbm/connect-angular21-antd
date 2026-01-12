import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { getHttpOptions } from '../http/http-utils';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends DataService {

  constructor() {
    super('/api/system/permission');
  }

  isLogin(): Observable<boolean> {
    const url = `${this.API_URL}/islogin`;
    const options = getHttpOptions();

    return this.http.get<boolean>(url, options).pipe(
      catchError(this.handleError<boolean>('isLogin', undefined))
    );
  }

}
