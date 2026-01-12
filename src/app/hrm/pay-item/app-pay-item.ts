import { Component, OnInit, inject, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NgPage } from "src/app/core/app/nz-page";

import { PayItemSearch } from "./pay-item-search";
import { PayItemGrid } from './pay-item-grid';
import { PayItemFormDrawer } from "./pay-item-form-drawer";

import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { NzSearchArea } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-pay-item',
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
    PayItemGrid,
    PayItemFormDrawer,
    PayItemSearch
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="급여항목 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <nz-search-area>
    <pay-item-search
      (search)="getList($event)"
      (newForm)="newResource()"
      (deleteForm)="delete()">
    </pay-item-search>
  </nz-search-area>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">급여항목 목록 {{drawer| json}} </h3>
    </div>
    <div style="height: 500px">
      <pay-item-grid #grid
        (rowClicked)="gridRowClicked($event)"
        (editButtonClicked)="editResource($event)"
        (rowDoubleClicked)="editResource($event)">
      </pay-item-grid>
    </div>
  </div>
</ng-page>

<pay-item-form-drawer
  [drawer]="drawer.payitem"
  (drawerClosed)="getList('')">
</pay-item-form-drawer>
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
export class AppPayItem implements OnInit, AfterViewInit {

  private http = inject(HttpClient);

  grid = viewChild.required(PayItemGrid);

  drawer: {
    payitem: { visible: boolean, formDataId: any }
  } = {
    payitem: { visible: false, formDataId: null }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
  }

  getList(params: any): void {
    this.drawer.payitem.visible = false;
    console.log(params);
    this.grid().gridQuery.set(params);
  }

  newResource(): void {
    this.drawer.payitem.formDataId = null;
    this.drawer.payitem.visible = true;
  }

  editResource(item: any): void {
    this.drawer.payitem.formDataId = item.payItemCode;
    this.drawer.payitem.visible = true;
  }

  delete(): void {

    const id = this.grid().getSelectedRows()[0].payItemCode;

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
      this.drawer.payitem.formDataId = item.payItemCode;
    }
  }

}
