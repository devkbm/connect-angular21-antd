import { NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';

import { Component, inject, viewChild, output, input } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';


export interface DeptHierarchy {
  parentDeptCode: string;
  deptCode: string;
  deptNameKorean: string;
  deptAbbreviationKorean: string;
  deptNameEnglish: string;
  deptAbbreviationEnglish: string;
  fromDate: string;
  toDate: string;
  seq: number;
  comment: string;

  title: string;
  key: string;
  isLeaf: boolean;
  children: DeptHierarchy[];
}

@Component({
  selector: 'dept-tree',
  imports: [ NzTreeModule ],
  template: `
    <!--
    <button (click)="getCommonCodeHierarchy()">
        조회
    </button>
    -->
    {{searchValue()}}
    <nz-tree
        #treeComponent
        [nzData]="nodeItems"
        [nzSearchValue]="searchValue()"
        (nzClick)="nzClick($event)">
    </nz-tree>
  `,
  styles: ['']
})
export class DeptTree {

  treeComponent = viewChild.required(NzTreeComponent);

  nodeItems: DeptHierarchy[] = [];

  searchValue = input.required<string>();
  companyCode = input.required<string>();

  itemSelected = output<any>();

  private http = inject(HttpClient);

  public getDeptHierarchy(companyCode: string) {
    const url = GlobalProperty.serverUrl() + `/api/system/depttree`;
    const options = getHttpOptions({company: companyCode});

    this.http.get<ResponseList<DeptHierarchy>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Dept>>('saveDept', undefined))
        )
        .subscribe(
          (model: ResponseList<DeptHierarchy>) => {
            model.data ? this.nodeItems = model.data : this.nodeItems = [];
          }
        )
  }

  nzClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

}
