import { Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
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

import { ResponseList } from 'src/app/core/model/response-list';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { GlobalProperty } from 'src/app/core/global-property';

export interface DataDomain {
  domainId: string | null;
  database: string | null;
  domainName: string | null;
  dataType: string | null;
  comment: string | null;
}


@Component({
  selector: 'data-domain-grid',
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
    [getRowId]="getRowId"
    [defaultColDef]="defaultColDef"
    (gridReady)="onGridReady($event)"
    (rowClicked)="rowClickedFunc($event)"
    (rowDoubleClicked)="rowDbClickedFunc($event)">
  </ag-grid-angular>
  `,
  styles: []
})
export class DataDomainGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<DataDomain>();
  rowDoubleClicked = output<DataDomain>();
  editButtonClicked = output<DataDomain>();

  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', padding: '0px'},
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
    /*{headerName: '도메인ID',      field: 'domainId',      width: 100 },*/
    {headerName: '데이터베이스',  field: 'database',      width: 100 },
    {headerName: '도메인',        field: 'domainName',    width: 100 },
    {headerName: '데이터타입',    field: 'dataType',      width: 150 },
    {headerName: '비고',          field: 'comment',       width: 400 }
  ];

  getRowId: GetRowIdFunc<DataDomain> = (params: GetRowIdParams<DataDomain>) => {
    return params.data.domainId!;
  };

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<DataDomain>>(
      GlobalProperty.serverUrl() + `/api/system/datadomin`,
      getHttpOptions(params)
    )
  })

  rowClickedFunc(event: RowClickedEvent<DataDomain>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClickedFunc(event: RowDoubleClickedEvent<DataDomain>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

}
