import { Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';

import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface Staff {
  companyCode: string | null;
  staffNo: string | null;
  name: string | null;
  nameEng: string | null;
  nameChi: string | null;
  residentRegistrationNumber: string | null;
  gender: string | null;
  birthday: Date | null;
  workCondition: string | null;
  imagePath: string | null;
  deptHistory?: any;
  jobHistory?: any;
  deptChangeHistory?: any;
  jobChangeHistory?: any;
  statusChangeHistory?: any;
}


@Component({
  selector: 'staff-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="gridResource.value()?.data ?? []"
      [style.height]="'100%'"
      [defaultColDef]="defaultColDef"
      [columnDefs]="columnDefs"
      [getRowId]="getRowId"
      [rowSelection]="rowSelection"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDbClickedFunc($event)">
    </ag-grid-angular>
  `,
  styles: []
})
export class StaffGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<Staff>();
  rowDoubleClicked = output<Staff>();
  editButtonClicked = output<Staff>();

  columnDefs: ColDef[] = [
    /*{
      headerName: '',
      width: 34,
      cellStyle: {'text-align': 'center', padding: '0px'},
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        iconType: 'form'
      }
    },*/
    {
      headerName: '',
      valueGetter: 'node.rowIndex + 1',
      width: 38,
      cellStyle: {'text-align': 'center'}
    },
    {headerName: '직원번호',      field: 'staffNo',         width: 77},
    {headerName: '직원명',        field: 'name',            width: 75 }
    /*{headerName: '생년월일',      field: 'birthday',        width: 200 } */
  ];

  getRowId: GetRowIdFunc<Staff> = (params: GetRowIdParams<Staff>) => {
    return params.data.companyCode! + params.data.staffNo!;
  };

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<Staff>>(
      GlobalProperty.serverUrl() + `/api/hrm/staff`,
      getHttpOptions(params)
    )
  })

  rowClickedFunc(event: RowClickedEvent<Staff>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClickedFunc(event: RowDoubleClickedEvent<Staff>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
