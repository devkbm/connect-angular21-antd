import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzSearchArea } from "src/app/third-party/ng-zorro/nz-search-area/nz-search-area";

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'web-resource-search',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzSpaceModule,
    NzSearchArea
],
  template: `
  <nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-space-compact nzBlock>
          <nz-select [(ngModel)]="query.resource.key">
            @for (option of query.resource.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>

          <nz-input-search>
            <input type="text" [(ngModel)]="query.resource.value" nz-input placeholder="input search text" (keyup.enter)="btnSearchClicked()">
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
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebResourceSearch {

  search = output<Object>();
  newForm = output<void>();
  deleteForm = output<void>();

  query: {
    resource : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    resource : {
      key: 'resourceCode',
      value: '',
      list: [
        {label: '리소스코드', value: 'resourceCode'},
        {label: '리소스명', value: 'resourceName'},
        {label: 'URL', value: 'url'},
        {label: '설명', value: 'description'}
      ]
    }
  }

  btnSearchClicked() {
    let params: any = new Object();
    if ( this.query.resource.value !== '') {
      params[this.query.resource.key] = this.query.resource.value;
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
