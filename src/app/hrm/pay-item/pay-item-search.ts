import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';


@Component({
  selector: 'pay-item-search',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzSpaceModule,
  ],
  template: `
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-space-compact nzBlock>
          <nz-select [(ngModel)]="query.user.key">
            @for (option of query.user.list; track option.value) {
            <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>

          <nz-input-search>
            <input type="text" [(ngModel)]="query.user.value" nz-input placeholder="input search text" (keyup.enter)="btnSearchClicked()">
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
  `,
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayItemSearch {

  search = output<Object>();
  newForm = output<void>();
  deleteForm = output<void>();

  query: {
    user : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    user : {
      key: 'payItemCode',
      value: '',
      list: [
        {label: '급여항목코드', value: 'payItemCode'},
        {label: '급여항목명', value: 'payItemName'}
      ]
    }
  }

  btnSearchClicked() {
    let params: any = new Object();
    if ( this.query.user.value !== '') {
      params[this.query.user.key] = this.query.user.value;
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
