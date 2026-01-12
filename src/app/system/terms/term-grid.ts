import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { ResponseList } from 'src/app/core/model/response-list';
import { NotifyService } from 'src/app/core/service/notify.service';

import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { rxResource } from '@angular/core/rxjs-interop';


export interface Term {
  termId: string | null;
  system: string | null;
  term: string | null;
  termEng: string | null;
  columnName: string | null;
  dataDomainId: string | null;
  domainName?: string | null;
  description: string | null;
  comment: string | null;
}


@Component({
  selector: 'term-grid',
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
  `
})
export class TermGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<Term>();
  rowDoubleClicked = output<Term>();
  editButtonClicked = output<Term>();

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
    {headerName: '용어ID',      field: 'termId',            width: 200 },
    {headerName: '시스템',      field: 'system',            width: 100 },
    {headerName: '용어',        field: 'term',              width: 200 , tooltipField: 'term'},
    {headerName: '용어(영문)',  field: 'termEng',           width: 150 },
    {headerName: '컬럼명',      field: 'columnName',        width: 200 },
    {headerName: '도메인명',    field: 'dataDomainName',    width: 100 },
    {headerName: '설명',        field: 'description',       width: 400 },
    {headerName: '비고',        field: 'comment',           width: 400 }
  ];

  getRowId: GetRowIdFunc<Term> = (params: GetRowIdParams<Term>) => {
      return params.data.termId!;
  };

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<Term>>(
      GlobalProperty.serverUrl() + `/api/system/terms`,
      getHttpOptions(params)
    )
  })

  rowClickedFunc(event: RowClickedEvent<Term>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClickedFunc(event: RowDoubleClickedEvent<Term>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
