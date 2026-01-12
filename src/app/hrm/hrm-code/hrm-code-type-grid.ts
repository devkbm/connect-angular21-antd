import { Component, OnInit, Input, output } from '@angular/core';
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

export interface HrmType {
  typeId: string | null;
  typeName: string | null;
  sequence: number | null;
  comment: string | null;
  fieldConfig: string | null;
  /*
  the1AddInfoDesc: string | null;
	the2AddInfoDesc: string | null;
	the3AddInfoDesc: string | null;
	the4AddInfoDesc: string | null;
	the5AddInfoDesc: string | null;
  */
}


@Component({
  selector: 'hrm-code-type-grid',
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
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `
})
export class HrmCodeTypeGridComponent extends AgGridCommon {

  @Input() list: HrmType[] = [];

  rowClicked = output<HrmType>();
  rowDoubleClicked = output<HrmType>();
  editButtonClicked = output<HrmType>();

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
    { headerName: '분류ID',       field: 'typeId',          width: 150 },
    { headerName: '분류명',       field: 'typeName',        width: 200 },
    { headerName: '설명',         field: 'comment',         width: 200 },
    { headerName: '순번',         field: 'sequence',        width: 80 }
  ];

  getRowId: GetRowIdFunc<HrmType> = (params: GetRowIdParams<HrmType>) => {
    return params.data.typeId!;
  };

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<HrmType>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }


}
