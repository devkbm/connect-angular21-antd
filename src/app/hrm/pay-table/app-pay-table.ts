import { Component, OnInit, inject, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NgPage } from "src/app/core/app/nz-page";

import { PayTableSearch } from "./pay-table-search";
import { PayTableGrid } from './pay-table-grid';
import { PayTableFormDrawer } from "./pay-table-form-drawer";

import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { NzSearchArea } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-pay-table',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzInputModule,
    NzDividerModule,
    NzPageHeaderCustom,
    NzSearchArea,
    NgPage,
    PayTableGrid,
    PayTableFormDrawer,
    PayTableSearch
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="급여테이블 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <nz-search-area>
    <pay-table-search
      (search)="getList($event)"
      (newForm)="newResource()"
      (deleteForm)="delete()">
    </pay-table-search>
  </nz-search-area>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">급여항목 목록 {{drawer| json}} </h3>
    </div>
    <div style="height: 500px">
      <pay-table-grid #grid
        (rowClicked)="gridRowClicked($event)"
        (editButtonClicked)="editResource($event)"
        (rowDoubleClicked)="editResource($event)">
      </pay-table-grid>
    </div>
  </div>
</ng-page>

<pay-table-form-drawer
  [drawer]="drawer.paytable"
  (drawerClosed)="getList('')">
</pay-table-form-drawer>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.grid-wrapper {
  display: grid;
  grid-template-rows: 24px 1fr;
  grid-template-columns: 200px 1fr;
}

  `
})
export class AppPayTable implements OnInit, AfterViewInit {

  private http = inject(HttpClient);

  grid = viewChild.required(PayTableGrid);

  drawer: {
    paytable: { visible: boolean, formDataId: any }
  } = {
    paytable: { visible: false, formDataId: null }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
  }

  getList(params: any): void {
    this.drawer.paytable.visible = false;
    console.log(params);
    this.grid().gridQuery.set(params);
  }

  newResource(): void {
    this.drawer.paytable.formDataId = null;
    this.drawer.paytable.visible = true;
  }

  editResource(item: any): void {
    this.drawer.paytable.formDataId = item.id;
    this.drawer.paytable.visible = true;
  }

  delete(): void {

    const id = this.grid().getSelectedRows()[0].id;

    const url = GlobalProperty.serverUrl() + `/api/hrm/payitem/${id}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<void>>(url, options).pipe(
        //   catchError(this.handleError<ResponseObject<Company>>('delete', undefined))
        )
        .subscribe(
          (model: ResponseObject<void>) => {
            this.grid().gridResource.reload();
          }
      )
  }

  gridRowClicked(item: any): void {
    if (item) {
      this.drawer.paytable.formDataId = item.id;
    }
  }

}
