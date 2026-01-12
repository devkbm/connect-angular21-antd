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

export interface PayItemStaff {
  id: string | null;
  companyCode: string | null;
  staffNo: string | null;
  staffName: string | null;
  payItemCode: string | null;
  payItemName: string | null;
  from: Date | null;
  to: Date | null;
  wageAmount: number | null;
  comment: string | null;
}

@Component({
  selector: 'pay-item-staff-grid',
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
export class PayItemStaffGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<PayItemStaff>();
  rowDoubleClicked = output<PayItemStaff>();
  editButtonClicked = output<PayItemStaff>();

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
    { headerName: '직원번호',       field: 'staffNo',     width: 150, filter: 'agTextColumnFilter' },
    { headerName: '직원명',         field: 'staffName',   width: 200, filter: 'agTextColumnFilter' },
    { headerName: '급여항목코드',    field: 'payItemCode', width: 150, filter: 'agTextColumnFilter' },
    { headerName: '급여항목코드명',  field: 'payItemName', width: 200, filter: 'agTextColumnFilter' },
    { headerName: '금액',           field: 'wageAmount',  width: 200, filter: 'agTextColumnFilter' },
    { headerName: '설명',           field: 'comment',     width: 200, filter: 'agTextColumnFilter' },
    { headerName: '시작일',         field: 'from',        width: 80,  filter: 'agNumberColumnFilter' },
    { headerName: '시작일',         field: 'to',          width: 80,  filter: 'agNumberColumnFilter' }
  ];

  getRowId: GetRowIdFunc<PayItemStaff> = (params: GetRowIdParams<PayItemStaff>) => {
    return params.data.companyCode! + params.data.payItemCode!;
  };

  constructor() {
    super();
    this.gridResource.reload();
  }

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<PayItemStaff>>(
      GlobalProperty.serverUrl() + `/api/hrm/payitemstaff`,
      getHttpOptions(params)
    )
  })


  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<PayItemStaff>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
