import { Component, OnInit, inject, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NgPage } from "src/app/core/app/nz-page";

import { PayExpressionGrid } from './pay-expression-grid';
import { PayExpressionFormDrawer } from './pay-expression-form-drawer';
import { PayExpressionSearch } from './pay-expression-search';

import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { NzSearchArea } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-pay-expression',
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
    PayExpressionGrid,
    PayExpressionFormDrawer,
    PayExpressionSearch
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="급여계산식 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <nz-search-area>
    <pay-expression-search
      (search)="getList($event)"
      (newForm)="newResource()"
      (deleteForm)="delete()">
    </pay-expression-search>
  </nz-search-area>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">급여계산식 목록 {{drawer| json}} </h3>
    </div>
    <div style="height: 500px">
      <pay-expression-grid #grid
        (rowClicked)="gridRowClicked($event)"
        (editButtonClicked)="editResource($event)"
        (rowDoubleClicked)="editResource($event)">
      </pay-expression-grid>
    </div>
  </div>
</ng-page>

<pay-expression-form-drawer
  [drawer]="drawer.payexpression"
  (drawerClosed)="getList('')">
</pay-expression-form-drawer>
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
export class AppPayExpression implements OnInit, AfterViewInit {

  private http = inject(HttpClient);

  grid = viewChild.required(PayExpressionGrid);

  drawer: {
    payexpression: { visible: boolean, formDataId: any }
  } = {
    payexpression: { visible: false, formDataId: null }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
  }

  getList(params: any): void {
    this.drawer.payexpression.visible = false;
    console.log(params);
    this.grid().gridQuery.set(params);
  }

  newResource(): void {
    this.drawer.payexpression.formDataId = null;
    this.drawer.payexpression.visible = true;
  }

  editResource(item: any): void {
    this.drawer.payexpression.formDataId = item.id;
    this.drawer.payexpression.visible = true;
  }

  delete(): void {

    const id = this.grid().getSelectedRows()[0].id;

    const url = GlobalProperty.serverUrl() + `/api/hrm/payexpression/${id}`;
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
      this.drawer.payexpression.formDataId = item.id;
    }
  }

}
