import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';
import { CheckboxRenderer } from 'src/app/third-party/ag-grid/renderer/checkbox-renderer';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

export interface HrmCode {
  typeId: string | null;
  code: string | null;
  codeName: string | null;
  useYn: boolean | null;
  sequence: number | null;
  comment: string | null;
  fieldConfig: string | null;
  extraInfo: any;
}



@Component({
  selector: 'hrm-code-grid',
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
export class HrmCodeGridComponent extends AgGridCommon {

  @Input() list: HrmCode[] = [];
  @Input() appointmentCode: any = '';

  rowClicked = output<HrmCode>();
  rowDoubleClicked = output<HrmCode>();
  editButtonClicked = output<HrmCode>();

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
    { headerName: '코드',         field: 'code',        width: 150, filter: 'agTextColumnFilter' },
    { headerName: '코드명',       field: 'codeName',    width: 200, filter: 'agTextColumnFilter' },
    { headerName: '설명',         field: 'comment',     width: 200, filter: 'agTextColumnFilter' },
    {
      headerName: '사용여부',
      field: 'useYn',
      width: 80,
      cellStyle: {'text-align': 'center', padding: '0px'},
      cellRenderer: CheckboxRenderer,
      cellRendererParams: {
        label: '',
        disabled: true
      }
    },
    { headerName: '순번',         field: 'sequence',    width: 80,  filter: 'agNumberColumnFilter' }
  ];

  getRowId: GetRowIdFunc<HrmCode> = (params: GetRowIdParams<HrmCode>) => {
    return params.data.typeId! + params.data.code!;
  };


  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<HrmCode>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
