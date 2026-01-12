import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { NgPage } from "src/app/core/app/nz-page";
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';

import { WebResourceGrid } from './web-resource-grid';
import { WebResourceFormDrawer } from './web-resource-form-drawer';
import { WebResourceSearch } from './web-resource-search';
import { WebResourceList } from './web-resource-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface WebResource {
  resourceId: string | null;
  resourceName: string | null;
  resourceType: string | null;
  url: string | null;
  description: string | null;
}

@Component({
  selector: 'web-resource-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzPageHeaderCustom,
    WebResourceGrid,
    WebResourceFormDrawer,
    WebResourceSearch,
    NgPage,
    WebResourceList
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="리소스 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <web-resource-search
    (search)="getList($event)"
    (newForm)="newResource()"
    (deleteForm)="delete()"
  />
</ng-template>

<ng-page
  [header]="{template: header, height: 'var(--page-header-height)'}"
  [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">웹서버 리소스 목록</h3>
    </div>

    <div style="flex: 1">
    @defer {
      @if (view === 'grid') {
        <web-resource-grid #grid
          (rowClicked)="resourceGridRowClicked($event)"
          (editButtonClicked)="editResource($event)"
          (rowDoubleClicked)="editResource($event)">
        </web-resource-grid>
      }
      @else if (view === 'list') {
        <web-resource-list (editButtonClicked)="editResource($event)">
        </web-resource-list>
      }
    }
    </div>
  </div>
</ng-page>


<web-resource-form-drawer
  [drawer]="drawer.resource"
  (drawerClosed)="getList('1')">
</web-resource-form-drawer>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.grid-title {
  height: 26px;
  margin-top: 6px;
  margin-left: 6px;
  padding-left: 6px;
  border-left: 6px solid green;
  vertical-align: text-top;
}
`
})
export class WebResourceApp implements OnInit {

  private http = inject(HttpClient);

  grid = viewChild.required(WebResourceGrid);
  list = viewChild.required(WebResourceList);

  view: 'grid' | 'list' = 'list';

  drawer: {
    resource: { visible: boolean, formDataId: any }
  } = {
    resource: { visible: false, formDataId: null }
  }

  ngOnInit(): void {
  }

  getList(params: any): void {
    console.log(params);
    this.drawer.resource.visible = false;
    this.grid().gridQuery.set(params);
  }

  newResource(): void {
    this.drawer.resource.formDataId = null;
    this.drawer.resource.visible = true;
  }

  editResource(item: any): void {
    this.drawer.resource.formDataId = item.resourceId;
    this.drawer.resource.visible = true;
  }

  delete(): void {
    const id = this.grid().getSelectedRows()[0].resourceId;

    const url = GlobalProperty.serverUrl() + `/api/system/webresource/${id}`;
    const options = getHttpOptions();
    this.http.delete<ResponseObject<WebResource>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseObject<WebResource>) => {
        //this.notifyService.changeMessage(model.message);
        this.getList('');
      }
    );

  }

  resourceGridRowClicked(item: any): void {
    this.drawer.resource.formDataId = item.resourceId;
  }

}
