import { Component, OnInit, Input, inject, viewChild, output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { NzFormatEmitEvent, NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';

export interface CommonCodeHierarchy {
  id: string
  systemTypeCode: string;
  code: string;
  codeName: string;
  codeNameAbbreviation: string;
  fromDate: string;
  toDate: string;
  hierarchyLevel: number;
  fixedLengthYn: boolean;
  codeLength: number;
  cmt: string;
  parentId: string;

  title: string;
  key: string;
  isLeaf: boolean;
  children: CommonCodeHierarchy[];
}

@Component({
  selector: 'hierarchy-code-tree',
  imports: [ NzTreeModule ],
  template: `
    {{searchValue}}
    <nz-tree
        #treeComponent
        [nzData]="nodeItems"
        [nzSearchValue]="searchValue"
        (nzClick)="nzClick($event)">
    </nz-tree>
  `,
  styles: ['']
})
export class HierarchyCodeTree {

  private http = inject(HttpClient);

  treeComponent = viewChild.required(NzTreeComponent);

  nodeItems: CommonCodeHierarchy[] = [];

  @Input() searchValue = '';
  itemSelected = output<any>();

  getCommonCodeHierarchy(systemTypeCode: string) {

    const url = GlobalProperty.serverUrl() + `/api/system/hierarchycode/treequery`;
    const options = getHttpOptions();

    this.http.get<ResponseList<CommonCodeHierarchy>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseList<CommonCodeHierarchy>) => {
            model.data ? this.nodeItems = model.data : this.nodeItems = [];
          }
        );
  }

  nzClick(event: NzFormatEmitEvent) {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

}
