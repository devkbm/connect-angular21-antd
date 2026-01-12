import { CommonModule } from '@angular/common';

import { Component, OnInit, inject, viewChild, output, input } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormatEmitEvent, NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';
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
  selector: 'checkable-dept-tree',
  imports: [
    CommonModule, NzTreeModule
  ],
  template: `
    {{defaultCheckedKeys}}
    <nz-tree
        #treeComponent
        nzCheckable
        [nzData]="nodeItems"
        [nzCheckedKeys]="defaultCheckedKeys"
        [nzSearchValue]="searchValue()"
        (nzCheckBoxChange)="nzCheck()"
        (nzClick)="nzClick($event)">
    </nz-tree>
  `,
  styles: ['']
})
export class CheckableDeptTree {

  private http = inject(HttpClient);

  treeComponent = viewChild.required(NzTreeComponent);

  nodeItems: DeptHierarchy[] = [];
  defaultCheckedKeys: any = [''];

  searchValue = input.required<string>();

  itemSelected = output<any>();
  itemChecked = output<any>();

  public getDeptHierarchy(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/depttree`;
    const options = getHttpOptions();

    this.http.get<ResponseList<DeptHierarchy>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Dept>>('saveDept', undefined))
        )
        .subscribe(
          (model: ResponseList<DeptHierarchy>) => {
            if ( model.data) {
              this.nodeItems = model.data;
              } else {
              this.nodeItems = [];
              }
          }
        )
  }

  nzClick(event: NzFormatEmitEvent): void {
      const node = event.node?.origin;
      this.itemSelected.emit(node);
  }

  nzCheck(): void {

      //this.defaultCheckedKeys = event.keys;
      //this.itemChecked.emit(event.keys);
    }

}
