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
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface Word {
  logicalName: string | null;
  logicalNameEng: string | null;
  physicalName: string | null;
  comment: string | null;
}


@Component({
  selector: 'app-word-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="list"
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
export class WordGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<Word>();
  rowDoubleClicked = output<Word>();
  editButtonClicked = output<Word>();

  list: Word[] = [];

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
    {headerName: '논리명',        field: 'logicalName',     width: 100 },
    {headerName: '물리명',        field: 'physicalName',    width: 100 },
    {headerName: '논리명(영문)',  field: 'logicalNameEng',  width: 100 },
    {headerName: '비고',          field: 'comment',         width: 400 }
  ];

  getRowId: GetRowIdFunc<Word> = (params: GetRowIdParams<Word>) => {
    return params.data.logicalName!;
  };

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<Word>>(
      GlobalProperty.serverUrl() + `/api/system/word`,
      getHttpOptions(params)
    )
  })

  rowClickedFunc(event: RowClickedEvent<Word>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClickedFunc(event: RowDoubleClickedEvent<Word>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
