import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { NzListModule } from 'ng-zorro-antd/list';

import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface StaffDutyResponsibility {
  staffNo: string | null;
  staffName: string | null;
  seq: string | null;
  dutyResponsibilityCode: string | null;
  dutyResponsibilityName: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  isPayApply: boolean | null;
}


@Component({
  selector: 'staff-duty-responsibility-list',
  imports: [
    CommonModule, NzListModule
  ],
  template: `
   <nz-list>
    @for (item of gridResource.value()?.data; track item.seq) {
      <nz-list-item>
        직책 : {{ item.dutyResponsibilityName }} &nbsp;&nbsp;&nbsp;&nbsp; 기간: {{ item.fromDate }} ~ {{ item.toDate }}
      </nz-list-item>
    }
    </nz-list>
  `,
  styles: []
})
export class StaffDutyResponsibilityList {

  private http = inject(HttpClient);

  staffNo = input<string>();

  constructor() { }

  gridResource = rxResource({
    params: () => this.staffNo(),
    stream: ({params}) => this.http.get<ResponseList<StaffDutyResponsibility>>(
      GlobalProperty.serverUrl() + `/api/hrm/staff/${params}/dutyresponsibility`,
      getHttpOptions()
    )
  })

}
