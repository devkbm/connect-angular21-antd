import { Component, output, input, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface StaffSchoolCareer {
	staffNo: string | null;
	staffName: string | null;
  seq: string | null;
	schoolCareerType: string | null;
	schoolCode: string | null;
	fromDate: Date | null;
	toDate: Date | null;
	majorName: string | null;
	pluralMajorName: string | null;
	location: string | null;
	lessonYear: number | null;
	comment: string | null;
}


@Component({
  selector: 'staff-school-career-grid',
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
  `,
  styles: []
})
export class StaffSchoolCareerGrid extends AgGridCommon {

  private http = inject(HttpClient);

  staffNo = input<string>();

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

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
    { headerName: '학력',           field: 'schoolCareerTypeName',  width: 100 },
    { headerName: '학교',           field: 'schoolCodeName',        width: 150 },
    { headerName: '입학일',         field: 'fromDate',          width: 90 },
    { headerName: '졸업일',         field: 'toDate',            width: 90 },
    { headerName: '전공',           field: 'majorName',         width: 100 },
    { headerName: '부전공',         field: 'pluralMajorName',   width: 100 },
    { headerName: '지역',           field: 'location',          width: 100 },
    { headerName: '수업연한',       field: 'lessonYear',        width: 100 },
    { headerName: '비고',           field: 'comment',           width: 200 }
  ];

  getRowId: GetRowIdFunc<StaffSchoolCareer> = (params: GetRowIdParams<StaffSchoolCareer>) => {
    return params.data.staffNo! + params.data.seq!;
  };

  gridResource = rxResource({
    params: () => this.staffNo(),
    stream: ({params}) => this.http.get<ResponseList<StaffSchoolCareer>>(
      GlobalProperty.serverUrl() + `/api/hrm/staff/${params}/schoolcareer`,
      getHttpOptions(params)
    )
  })

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<StaffSchoolCareer>) {
    this.rowDoubleClicked.emit(event.data);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }
}
