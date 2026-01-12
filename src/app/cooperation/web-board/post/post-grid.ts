import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, FirstDataRenderedEvent, GridSizeChangedEvent, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface Post {
  postId: string;
  boardId: string;
  postParentId: string;
  userId: string;
  title: string;
  contents: string;
  pwd: string;
  hitCnt: string;
  fromDate: string;
  toDate: string;
  seq: number;
  depth: number;
  fileList: string[];
  file: File;
  editable: boolean
}

@Component({
  selector: 'post-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="_data"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridSizeChanged)="onGridSizeChanged($event)"
      (rowClicked)="rowClickedEvent($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `
})
export class PostGrid extends AgGridCommon implements OnInit {

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  rowClicked = output<Post | undefined>();
  rowDoubleClicked = output<Post | undefined>();
  editButtonClicked = output<Post | undefined>();

  _data: Post[] = [];

  columnDefs: ColDef[] = [
    {
        headerName: '번호',
        //valueGetter: 'node.rowIndex + 1',
        field: 'articleId',
        width: 70,
        cellStyle: {'text-align': 'center'},
        suppressSizeToFit: true
    },
    {
        headerName: '제목',
        field: 'title'
    },
    {
      headerName: '등록일자',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'createdDt',
      width: 210,
      cellStyle: {'text-align': 'center'},
      suppressSizeToFit: true
    },
    {
      headerName: '수정일자',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'modifiedDt',
      width: 210,
      cellStyle: {'text-align': 'center'},
      suppressSizeToFit: true
    },
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px'},
      cellRenderer: ButtonRenderer,
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        iconType: 'form'
      },
      suppressSizeToFit: true
    }
  ];

  getRowId: GetRowIdFunc<Post> = (params: GetRowIdParams<Post>) => {
    return params.data.postId;
  };

  ngOnInit() {
    //this.setWidthAndHeight('100%', '100%');
  }

  getPostList(boardId: any): void {
    /*
    this.boardService
        .getList(fkBoard)
        .subscribe(
          (model: ResponseList<Post>) => {
            this._data = model.data;
            this.notifyService.changeMessage(model.message);
          }
        );
    */

    let url = GlobalProperty.serverUrl() + `/api/grw/board/post?boardId=${boardId}`;
    const options = getHttpOptions();

    this.http.get<ResponseList<Post>>(url, options).pipe(
      //  catchError((err) => Observable.throw(err))
    );
  }

  rowClickedEvent(params: RowClickedEvent<Post>) {
    const selectedRows = params.api.getSelectedRows();
    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(params: RowDoubleClickedEvent<Post>) {
    this.rowDoubleClicked.emit(params.data);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    /*
    var gridWidth = document.getElementById("grid-wrapper").offsetWidth;
    var columnsToShow = [];
    var columnsToHide = [];
    var totalColsWidth = 0;
    var allColumns = this.gridColumnApi.getAllColumns();

    for (var i = 0; i < allColumns.length; i++) {
      let column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    */
        /*
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
    */

    //this.gridColumnApi.setColumnsVisible(columnsToShow, true);
    //this.gridColumnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

}
