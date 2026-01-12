import { Component, computed, inject, output, signal } from '@angular/core';
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

import { ResponseList } from 'src/app/core/model/response-list';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { rxResource } from '@angular/core/rxjs-interop';

export interface DateInfo {
  date: Date | null;
  dayOfWeek: string | null;
  holiday: Holiday | null;
  saturDay: boolean;
  sunday: boolean;
  weekend: boolean;
}

export interface Holiday {
  date: Date | null;
  holidayName: string | null;
  comment: string | null;
}


@Component({
  selector: 'holiday-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
  <!-- [style.height]="'100%'" -->
    <ag-grid-angular
      [theme]="theme"
      [rowData]="gridResource.value()?.data"
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
export class HolidayGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<DateInfo>();
  rowDoubleClicked = output<DateInfo>();
  editButtonClicked = output<DateInfo>();

  filteredList = computed(() => {
    if (!this.gridResource.hasValue()) return [];

    let dateList: Date[] = this.gridResource.value()!.data.filter((e) => { return (e.holiday?.holidayName ?? '') !== ''} )
                                        .map((e) => e.date!);
    let obj : any[] = [];
    dateList.forEach((element, index) => {
      obj.push({start: element, end: element});
    });
    return obj;
  });

  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px', 'margin': '0px' },
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
    { headerName: '일자',     field: 'date',                width: 110,   cellStyle: { textAlign: 'center'} },
    { headerName: '요일',     field: 'dayOfWeek',           width: 50,    cellStyle: {'text-align': 'center'} },
    { headerName: '휴일명',   field: 'holiday.holidayName', width: 150 },
    { headerName: '비고',     field: 'holiday.comment',     width: 200 }
  ];

  getRowId: GetRowIdFunc<any> = (params: GetRowIdParams<any>) => {
    return params.data.date!;
  };

  gridQuery = signal<{fromDate: string, toDate: string}>({fromDate: '20250101', toDate: '20251231'});
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<DateInfo>>(
      GlobalProperty.serverUrl() + `/api/system/holiday`,
      getHttpOptions(params)
    )
  })

  selectionChanged(event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<DateInfo>): void {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}): void {
    this.editButtonClicked.emit(e.rowData);
  }

}
