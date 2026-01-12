import { Component, OnInit, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowDoubleClickedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';

import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

export interface TeamModel {
  teamId: string | null;
  teamName: string | null;
  memberList: string[] | null;
}

export interface Team {
  teamId: string;
  teamName: string;
  memberList: string[];
}


@Component({
  selector: 'team-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="data"
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
export class TeamGridComponent extends AgGridCommon implements OnInit {

  rowClicked = output<TeamModel | undefined>();
  rowDoubleClicked = output<TeamModel | undefined>();
  editButtonClicked = output<TeamModel | undefined>();

  @Input() data: TeamModel[] = [];

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
    { headerName: '팀ID',       field: 'teamId',      width: 150, filter: 'agTextColumnFilter' },
    { headerName: '팀명',       field: 'teamName',    width: 200, filter: 'agTextColumnFilter' }
  ];

  getRowId: GetRowIdFunc<TeamModel> = (params: GetRowIdParams<TeamModel>) => {
    return params.data.teamId!;
  };

  ngOnInit() {

  }

  selectionChanged(event: SelectionChangedEvent<TeamModel>) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<TeamModel>) {
    this.rowDoubleClicked.emit(event.data);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
