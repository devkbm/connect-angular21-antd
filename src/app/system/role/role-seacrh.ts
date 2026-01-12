import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSearchArea } from "src/app/third-party/ng-zorro/nz-search-area/nz-search-area";

@Component({
  selector: 'role-seacrh',
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
          <nz-select [(ngModel)]="query.role.key">
            @for (option of query.role.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>

          <nz-input-search>
            <input type="text" [(ngModel)]="query.role.value" nz-input placeholder="input search text" (keyup.enter)="btnSearchClicked()">
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
export class RoleSeacrh {
  search = output<Object>();
  newForm = output<void>();
  deleteForm = output<void>();

  query: {
    role : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    role : {
      key: 'roleCode',
      value: '',
      list: [
        {label: '롤', value: 'roleCode'},
        {label: '설명', value: 'description'}
      ]
    }
  }

  btnSearchClicked() {
    let params: any = new Object();
    if ( this.query.role.value !== '') {
      params[this.query.role.key] = this.query.role.value;
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
