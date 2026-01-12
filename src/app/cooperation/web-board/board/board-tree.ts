import { CommonModule } from '@angular/common';
import { Component, inject, viewChild, output, input } from '@angular/core';

import { NzFormatEmitEvent, NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';

import { ResponseList } from 'src/app/core/model/response-list';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface BoardHierarchy {
  createdDt: Date;
  createdBy: string;
  modifiedDt: Date;
  modifiedBy: string;
  boardId: string;
  boardParentId: string;
  boardName: string;
  boardDescription: string;
  fromDate: Date;
  toDate: Date;
  articleCount: number;
  sequence: number;
  selected: boolean;
  expanded: boolean;
  isLeaf: boolean;
  active: boolean;
  children: BoardHierarchy[];
  title: string;
  key: string;
}

@Component({
  selector: 'board-tree',
  imports: [
    CommonModule,
    NzTreeModule
  ],
  template: `
    <!--{{items | json}}-->
    <!--{{ searchValue() }}-->
    <nz-tree
      #treeCom
      nzShowLine
      [nzData]="items"
      [nzSelectedKeys]="selectedKeys"
      [nzSearchValue]="searchValue()"
      (nzSearchValueChange)="searchValueChange($event)"
      (nzClick)="nzClick($event)"
      (nzDblClick)="nzDbClick($event)">
    </nz-tree>
  `,
  styles: `
  `
})
export class BoardTree {

  private http = inject(HttpClient);
  treeCom = viewChild.required(NzTreeComponent);

  protected items: BoardHierarchy[] = [];
  selectedKeys: string[] = [];

  searchValue = input.required<string>();

  itemSelected = output<any>();
  itemDbClicked = output<any>();

  getboardHierarchy(): void {
    let url = GlobalProperty.serverUrl() + `/api/grw/boardHierarchy`;
    const options = getHttpOptions();
    this.http
        .get<ResponseList<BoardHierarchy>>(url, options)
        .pipe(
          //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseList<BoardHierarchy>) => {
            if ( model.data ) {
              this.items = model.data;
              this.selectedKeys = [this.items[0].key];
              this.itemSelected.emit(this.items[0]);
            } else {
              this.items = [];
            }

              // title 노드 텍스트
              // key   데이터 키
              // isLeaf 마지막 노드 여부
              // checked 체크 여부
          }
        )
  }

  nzClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

  public nzDbClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemDbClicked.emit(node);
  }

  searchValueChange(event: NzFormatEmitEvent): void {
    const keys = event.keys;

    console.log(keys);
  }

}
