import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { ResponseList } from 'src/app/core/model/response-list';

export interface BizCode {
  typeId: string | null;
  code: string | null;
  codeName: string | null;
  useYn: boolean | null;
  sequence: number | null;
  comment: string | null;
}



@Component({
  selector: 'biz-code-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="_list"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDoubleClickedFunc($event)">
    </ag-grid-angular>
  `,
  styles: []
})
export class BizCodeGrid extends AgGridCommon {

  private http = inject(HttpClient);

  _list: BizCode[] = [];

  rowClicked = output<BizCode>();
  rowDoubleClicked = output<BizCode>();
  editButtonClicked = output<BizCode>();

  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px'},
      cellRenderer: ButtonRenderer,
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        iconType: 'form'
      }
    },
    {
      headerName: 'No',
      valueGetter: 'node.rowIndex + 1',
      width: 70,
      cellStyle: {'text-align': 'center'}
    },
    { headerName: '분류ID',       field: 'typeId',        width: 100 },
    { headerName: '코드',         field: 'code',          width: 200 },
    { headerName: '코드명',       field: 'codeName',      width: 200 },
    { headerName: '사용여부',     field: 'useYn',         width: 200 },
    { headerName: '순번',         field: 'sequence',      width: 50 },
    { headerName: '비고',         field: 'comment',       width: 400 }
  ];

  getRowId: GetRowIdFunc<BizCode> = (params: GetRowIdParams<BizCode>) => {
    return params.data.typeId! + params.data.code!;
  };

  getList(typeId: string): void {
    const url = GlobalProperty.serverUrl() + `/api/system/bizcodetype/${typeId}/bizcode`;
    const options = getHttpOptions();

    this.http.get<ResponseList<BizCode>>(url, options).pipe(
      //catchError(this.handleError<ResponseList<BizCode>>('getList', undefined))
    ).subscribe(
      (model: ResponseList<BizCode>) => {
        this._list = model.data;
      }
    );
  }

  rowClickedFunc(event: RowClickedEvent<BizCode>) {
    this.rowClicked.emit(event.data!);
  }

  rowDoubleClickedFunc(event: RowDoubleClickedEvent<BizCode>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}

