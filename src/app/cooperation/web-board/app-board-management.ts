import { Component, viewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { BoardForm } from './board/board-form';
import { BoardTree } from './board/board-tree';
import { NzButtonExcelUpload } from "../../third-party/ng-zorro/nz-button-excel-upload/nz-button-excel-upload";


@Component({
  selector: 'board-management-app',
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    BoardTree,
    BoardForm,
    NzButtonExcelUpload
],
  template: `
    <div nz-row class="search-div">
      <div nz-col [nzSpan]="24" style="text-align: right;">
        <app-nz-button-excel-upload [urn]="'/api/grw/board/post-excel'">
        </app-nz-button-excel-upload>

        <button nz-button (click)="getBoardTree()">
          <span nz-icon nzType="search" nzTheme="outline"></span>조회
        </button>
      </div>
    </div>

    <!--
    <button nz-button (click)="newBoard()">
      <span nz-icon nzType="form" nzTheme="outline"></span>게시판 등록
    </button>
    -->

    <div class="app-layout">
      <board-tree id="boardTree" #boardTree
        [searchValue]="queryValue"
        (itemSelected)="boardTreeItemClick($event)"
        (itemDbClicked)="modifyBoard($event)">
      </board-tree>

      <board-form #boardForm
        [formDataId]="this.drawerBoard.formDataId"
        (formSaved)="getBoardTree()"
        (formDeleted)="getBoardTree()"
        (formClosed)="drawerBoard.visible = false">
      </board-form>
    </div>

    <!--
    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      [nzWidth]="'80%'"
      [nzVisible]="drawerBoard.visible"
      nzTitle="게시판 등록"
      (nzOnClose)="drawerBoard.visible = false">
        <board-form #boardForm *nzDrawerContent
          [initLoadId]="this.drawerBoard.initLoadId"
          (formSaved)="getBoardTree()"
          (formDeleted)="getBoardTree()"
          (formClosed)="drawerBoard.visible = false">
        </board-form>
    </nz-drawer>
-->
  `,
  styles: [`
    .search-div {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      padding-left: auto;
      padding-right: 5;

      text-align: right;
    }

    .btn-search {
      text-align: right;
    }

    .app-layout {
      display: grid;
      grid-template-rows: 24px 1fr;
      grid-template-columns: 200px 1fr;
    }
  `]

})
export class BoardManagementApp implements AfterViewInit {

  boardTree = viewChild.required(BoardTree);

  drawerBoard: { visible: boolean, formDataId: any } = {
    visible: false,
    formDataId: null
  }

  /**
   * 게시판 트리 조회 Filter 조건
   */
  queryValue: any;

  constructor() {

  }

  ngAfterViewInit(): void {
    this.getBoardTree();
  }

  getBoardTree(): void {
    this.drawerBoard.visible = false;
    this.boardTree().getboardHierarchy();
  }

  newBoard(): void {
    this.drawerBoard.formDataId = null;
    this.drawerBoard.visible = true;
  }

  modifyBoard(item: any): void {
    this.drawerBoard.visible = true;
  }

  boardTreeItemClick(item: NzTreeNodeOptions) {
    this.drawerBoard.formDataId = item.key;
  }

}
