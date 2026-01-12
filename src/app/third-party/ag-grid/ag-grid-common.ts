import { ColDef, colorSchemeDark, RowSelectionOptions, themeBalham } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

export class AgGridCommon {

  public theme = themeBalham.withPart(colorSchemeDark);
  gridApi: any;
  gridColumnApi: any;

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  }

  defaultColDef: ColDef = { sortable: true, resizable: true };

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    ModuleRegistry.registerModules([AllCommunityModule]);
  }

  getSelectedRows() {
    return this.gridApi.getSelectedRows();
  }

}
