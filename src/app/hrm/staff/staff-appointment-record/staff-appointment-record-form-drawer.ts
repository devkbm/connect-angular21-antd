import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';

import { StaffAppointmentRecordForm } from './staff-appointment-record-form';

@Component({
  selector: 'staff-appointment-record-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroup,
    StaffAppointmentRecordForm
  ],
  template: `
    <nz-drawer
      nzTitle="발령 등록"
      nzWidth="80%"
      [nzMaskClosable]="true"
      [nzVisible]="drawer().visible"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
        <staff-appointment-record-form *nzDrawerContent
          [staff]="selectedStaff()"
          [formDataId]="drawer().formDataId"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
        </staff-appointment-record-form>
    </nz-drawer>

    <ng-template #footerTpl>
      <div style="float: right">
        <app-nz-crud-button-group
          [searchVisible]="false"
          [isSavePopupConfirm]="false"
          (closeClick)="closeDrawer()"
          (saveClick)="save()"
          (deleteClick)="remove()">
        </app-nz-crud-button-group>
      </div>
    </ng-template>
  `,
  styles: []
})
export class StaffAppointmentRecordFormDrawer {

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  selectedStaff = input<any>();

  form = viewChild.required<StaffAppointmentRecordForm>(StaffAppointmentRecordForm);

  save() {
    this.form().save();
  }

  remove() {
    //this.form().remove();
  }

  closeDrawer(params?: any) {
    this.form().closeForm();

    this.drawerClosed.emit(params);
  }

}
