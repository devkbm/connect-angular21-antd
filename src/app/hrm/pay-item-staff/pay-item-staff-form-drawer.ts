import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';

import { PayItemStaffForm } from "./pay-item-staff-form";

@Component({
  selector: 'pay-item-staff-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroup,

    PayItemStaffForm
],
  template: `
    <nz-drawer
      nzTitle="급여항목코드 등록"
      nzWidth="80%"
      [nzMaskClosable]="true"
      [nzVisible]="drawer().visible"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
      <pay-item-staff-form *nzDrawerContent
          [formDataId]="drawer().formDataId"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
      </pay-item-staff-form>
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
export class PayItemStaffFormDrawer {

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<PayItemStaffForm>(PayItemStaffForm);

  save() {
    this.form().save();
  }

  remove() {
    this.form().remove();
  }

  closeDrawer(params?: any) {
    this.form().closeForm();

    this.drawerClosed.emit(params);
  }
}
