import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';

export interface PayItem {
  companyCode: string | null;
  payItemCode: string | null;
  payItemName: string | null;
  type: string | null;
  usePayTable: boolean | null;
  seq: number | null;
  comment: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PayItemResource {

  readonly http = inject(HttpClient);

  params = signal<any>('');
  resource = rxResource({
    params: () => this.params(),
    stream: ({params}) => this.http.get<ResponseList<PayItem>>(
      GlobalProperty.serverUrl() + `/api/hrm/payitem`,
      getHttpOptions(params)
    )
  })

  data(): PayItem[] | undefined {
    return this.resource.value()?.data;
  }

  reload() {
    this.resource.reload();
  }

  getPayItemList(params: any): Observable<ResponseList<PayItem>> {
    const url = GlobalProperty.serverUrl() + `/api/hrm/payitem`;
    const options = getHttpOptions(params);

    return this.http.get<ResponseList<PayItem>>(url, options).pipe(
      //catchError(this.handleError<ResponseMap<HrmCode>>('getMapList', undefined))
    );
  }
}
