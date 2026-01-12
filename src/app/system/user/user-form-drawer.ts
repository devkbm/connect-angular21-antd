import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';

import { UserForm } from './user-form';

@Component({
  selector: 'user-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroup,
    UserForm
  ],
  template: `
    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      [nzWidth]="720"
      [nzVisible]="drawer().visible"
      nzTitle="사용자 등록"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
        <user-form *nzDrawerContent
          [formDataId]="drawer().formDataId"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
        </user-form>
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
export class UserFormDrawer {

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<UserForm>(UserForm);

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
