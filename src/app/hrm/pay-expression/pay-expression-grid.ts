import { Component, inject, Input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';

import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';
import { CheckboxRenderer } from 'src/app/third-party/ag-grid/renderer/checkbox-renderer';


ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

export interface PayExpression {
  id: string | null;
  companyCode: string | null;
  payItemCode: string | null;
  payItemName: string | null;
  payCondition: string | null;
  formula: string | null;
  seq: number | null;
  comment: string | null;
}

@Component({
  selector: 'pay-expression-grid',
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
export class PayExpressionGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<PayExpression>();
  rowDoubleClicked = output<PayExpression>();
  editButtonClicked = output<PayExpression>();

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
    { headerName: 'id',               field: 'id',            width: 150, filter: 'agTextColumnFilter' },
    { headerName: '급여항목코드',     field: 'payItemCode',   width: 150, filter: 'agTextColumnFilter' },
    { headerName: '급여항목코드명',   field: 'payItemName',   width: 200, filter: 'agTextColumnFilter' },
    { headerName: '조건',             field: 'wageAmount',    width: 200, filter: 'agTextColumnFilter' },
    { headerName: '계산식',           field: 'formula',       width: 200, filter: 'agTextColumnFilter' },
    { headerName: '순번',             field: 'seq',           width: 80,  filter: 'agNumberColumnFilter' },
    { headerName: '비고',             field: 'comment',       width: 80,  filter: 'agNumberColumnFilter' }
  ];

  getRowId: GetRowIdFunc<PayExpression> = (params: GetRowIdParams<PayExpression>) => {
    return params.data.id!;
  };

  constructor() {
    super();
    this.gridResource.reload();
  }

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<PayExpression>>(
      GlobalProperty.serverUrl() + `/api/hrm/payexpression`,
      getHttpOptions(params)
    )
  })


  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<PayExpression>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
