import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NzPageHeaderCustom } from "src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom";

import { NgPage } from "src/app/core/app/nz-page";

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';

import { CompanyList } from './company-list';
import { CompanySearch } from "./company-search";
import { CompanyGrid } from './company-grid';
import { CompanyFormDrawer } from "./company-form-drawer";

@Component({
  selector: 'app-company',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzPageHeaderCustom,
    NgPage,
    CompanyGrid,
    CompanyList,
    CompanyFormDrawer,
    CompanySearch
],
  template: `

<ng-template #header>
  <nz-page-header-custom title="회사 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <company-search
    (search)="getList($event)"
    (newForm)="newResource()"
    (deleteForm)="delete()">
  </company-search>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">회사 목록 {{drawer| json}} </h3>
    </div>
    <div style="flex: 1">
    @defer {
      @if (view === 'grid') {
        <company-grid #grid
          (rowClicked)="resourceGridRowClicked($event)"
          (editButtonClicked)="editResource($event)"
          (rowDoubleClicked)="editResource($event)">
        </company-grid>
      }
      @else if (view === 'list') {
        <company-list (editButtonClicked)="editResource($event)">
        </company-list>
      }
    }
    </div>
  </div>
</ng-page>

<company-form-drawer
  [drawer]="drawer.company"
  (drawerClosed)="getList('')">
</company-form-drawer>

  `,
  styles: `
  :host {
    --page-header-height: 98px;
    --page-search-height: 46px;
  }

  .grid-title {
    height: 26px;
    margin-top: 6px;
    margin-left: 6px;
    padding-left: 6px;
    border-left: 6px solid green;
    vertical-align: text-top;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  `
})
export class AppCompany implements OnInit {

  private http = inject(HttpClient);

  grid = viewChild.required(CompanyGrid);
  list = viewChild.required(CompanyList);

  view: 'grid' | 'list' = 'grid';

  query: {
    company : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    company : {
      key: 'resourceCode',
      value: '',
      list: [
        {label: '회사코드', value: 'resourceCode'},
        {label: '회사명', value: 'resourceName'},
        {label: 'URL', value: 'url'},
        {label: '설명', value: 'description'}
      ]
    }
  }

  drawer: {
    company: { visible: boolean, formDataId: any }
  } = {
    company: { visible: false, formDataId: null }
  }

  ngOnInit(): void {
  }

  getList(params: any): void {
    this.drawer.company.visible = false;

    this.grid().gridQuery.set(params);
  }

  newResource(): void {
    this.drawer.company.formDataId = null;
    this.drawer.company.visible = true;
  }

  editResource(item: any): void {
    this.drawer.company.formDataId = item.companyCode;
    this.drawer.company.visible = true;
  }

  delete(): void {

    const id = this.grid().getSelectedRows()[0].companyCode;

    const url = GlobalProperty.serverUrl() + `/api/system/company/${id}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<void>>(url, options).pipe(
        //   catchError(this.handleError<ResponseObject<Company>>('delete', undefined))
        )
        .subscribe(
          (model: ResponseObject<void>) => {
            this.getList('');
          }
      )
  }

  resourceGridRowClicked(item: any): void {
    this.drawer.company.formDataId = item.companyCode;
  }

}
