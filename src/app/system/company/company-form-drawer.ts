import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';

import { CompanyForm } from './company-form';

@Component({
  selector: 'company-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroup,
    CompanyForm
  ],
  template: `
    <nz-drawer
      [nzMaskClosable]="true"
      nzWidth="80%"
      [nzVisible]="drawer().visible"
      nzTitle="회사 등록"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
        <app-company-form *nzDrawerContent
          [formDataId]="drawer().formDataId"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
        </app-company-form>
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
  styles:[]
})
export class CompanyFormDrawer {
  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<CompanyForm>(CompanyForm);

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
