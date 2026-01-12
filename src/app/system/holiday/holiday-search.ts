import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzSearchArea } from "src/app/third-party/ng-zorro/nz-search-area/nz-search-area";

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'holidary-search',
  imports: [
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDividerModule,
    NzSpaceModule,
    NzSearchArea
],
  template: `
  <nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-space-compact nzBlock>
          <nz-select [(ngModel)]="query.holiday.key">
            @for (option of query.holiday.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>

          <nz-input-search>
            <input type="text" [(ngModel)]="query.holiday.value" nz-input placeholder="input search text" (keyup.enter)="btnSearchClicked()">
          </nz-input-search>
        </nz-space-compact>
      </div>
      <div nz-col [nzSpan]="12" style="text-align: right;">
        <button nz-button (click)="btnSearchClicked()">
          <span nz-icon nzType="search"></span>조회
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="btnNewClicked()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button nzDanger="true"
          nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
          (nzOnConfirm)="btnDeleteClicked()" (nzOnCancel)="false">
            <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>
      </div>
    </div>
  </nz-search-area>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidaySearch {
  search = output<Object>();
  newForm = output<void>();
  deleteForm = output<void>();

  query: {
    holiday : { key: string, value: string, year: Date, list: {label: string, value: string}[] },
  } = {
    holiday : {
      key: 'resourceCode',
      value: '',
      list: [
        {label: '휴일명', value: 'resourceCode'},
        {label: '비고', value: 'description'}
      ],
      year: new Date()
    }
  }

  btnSearchClicked() {
    let params: any = new Object();
    if ( this.query.holiday.value !== '') {
      params[this.query.holiday.key] = this.query.holiday.value;
    }

    this.search.emit(params);
  }

  btnNewClicked() {
    this.newForm.emit();
  }

  btnDeleteClicked() {
    this.deleteForm.emit();
  }

}
