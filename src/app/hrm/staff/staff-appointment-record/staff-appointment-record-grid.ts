import { Component, inject, output, input } from '@angular/core';
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

export interface StaffAppointmentRecord {
  staffNo: string | null;
  staffName: string | null;
  seq: string | null;
  appointmentTypeCode: string | null;
  applyType: string | null;
  appointmentDate: Date | null;
  appointmentEndDate: Date | null;
  recordName: string | null;
  comment: string | null;
  isCompleted: boolean | null;
  blngDeptCode: string | null;
  workDeptCode: string | null;
  jobGroupCode: string | null;
  jobPositionCode: string | null;
  occupationCode: string | null;
  jobGradeCode: string | null;
  payStepCode: string | null;
  jobCode: string | null;
  dutyResponsibilityCode: string | null;
}


@Component({
  selector: 'staff-appointment-record-grid',
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
export class StaffAppointmentRecordGrid extends AgGridCommon {

  private http = inject(HttpClient);

  staffNo = input<string>();

  rowClicked = output<StaffAppointmentRecord>();
  rowDoubleClicked = output<StaffAppointmentRecord>();
  editButtonClicked = output<StaffAppointmentRecord>();

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
    { headerName: '발령분류',       field: 'appointmentTypeName',     width: 90 },
    { headerName: '발령일',         field: 'appointmentDate',         width: 90 },
    { headerName: '발령종료일',     field: 'appointmentEndDate',      width: 90 },
    { headerName: '발령기록',       field: 'recordName',              width: 200 },
    { headerName: '소속부서',       field: 'blngDeptName',            width: 100 },
    { headerName: '근무부서',       field: 'workDeptName',            width: 100 },
    { headerName: '직군',           field: 'jobGroupName',            width: 80 },
    { headerName: '직위',           field: 'jobPositionName',         width: 80 },
    { headerName: '직종',           field: 'occupationName',          width: 80 },
    { headerName: '직급',           field: 'jobGradeName',            width: 80 },
    { headerName: '호봉',           field: 'payStepName',             width: 80 },
    { headerName: '직무',           field: 'jobName',                 width: 80 },
    { headerName: '직책',           field: 'dutyResponsibilityName',  width: 80 },
    { headerName: '비고',           field: 'comment',                 width: 80 }
  ];

  getRowId: GetRowIdFunc<StaffAppointmentRecord> = (params: GetRowIdParams<StaffAppointmentRecord>) => {
    return params.data.seq!;
  };

  gridResource = rxResource({
    params: () => this.staffNo(),
    stream: ({params}) => this.http.get<ResponseList<StaffAppointmentRecord>>(
      GlobalProperty.serverUrl() + `/api/hrm/staff/${params}/record`,
      getHttpOptions()
    )
  })

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<StaffAppointmentRecord>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }
}
