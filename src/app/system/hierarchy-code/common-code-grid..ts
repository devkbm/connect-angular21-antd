import { Component, OnInit, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { rxResource } from '@angular/core/rxjs-interop';

export interface CommonCode {
  systemTypeCode: string | null;
  codeId: string | null;
  parentId: string | null;
  code: string | null;
  codeName: string | null;
  codeNameAbbreviation: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  seq: number | null;
  hierarchyLevel: number | null;
  lowLevelCodeLength: number | null;
  cmt: string | null;
}

@Component({
  selector: 'common-code-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="gridResource.value()?.data ?? []"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
  </ag-grid-angular>
  `
})
export class CommonCodeGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<CommonCode>();
  rowDoubleClicked = output<CommonCode>();
  editButtonClicked = output<CommonCode>();

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
    { headerName: 'ID',            field: 'id',                    width: 150 },
    { headerName: '공통코드',      field: 'code',                  width: 200 },
    { headerName: '공통코드명',    field: 'codeName',              width: 200 },
    { headerName: '약어',          field: 'codeNameAbbreviation',  width: 200 },
    {
      headerName: '시작일',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'fromDate',
      width: 200
    },
    {
      headerName: '종료일',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'toDate',
      width: 200
    },
    { headerName: 'Url',           field: 'url',                   width: 200 },
    { headerName: '설명',          field: 'cmt',                   width: 300 }
  ];

  getRowId: GetRowIdFunc<CommonCode> = (params: GetRowIdParams<CommonCode>) => {
    return params.data.codeId!;
  };

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<CommonCode>>(
      GlobalProperty.serverUrl() + `/api/system/code`,
      getHttpOptions(params)
    )
  })

  selectionChanged(event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();
    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<CommonCode>): void {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}): void {
    this.editButtonClicked.emit(e.rowData);
  }

}
