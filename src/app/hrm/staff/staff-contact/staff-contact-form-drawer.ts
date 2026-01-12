import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';
import { StaffContactForm } from './staff-contact-form';

@Component({
  selector: 'staff-contact-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroup,
    StaffContactForm
  ],
  template: `
    <nz-drawer
      nzTitle="연락처 등록"
      nzWidth="80%"
      [nzMaskClosable]="true"
      [nzVisible]="drawer().visible"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
      <staff-contact-form *nzDrawerContent
          [formDataId]="drawer().formDataId"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
      </staff-contact-form>
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
export class StaffContactFormDrawerComponent {

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<StaffContactForm>(StaffContactForm);

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
