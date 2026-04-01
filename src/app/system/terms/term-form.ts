import { Component, OnChanges, SimpleChanges, inject, Renderer2, output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ResponseList } from '@src/app/core/model/response-list';
import { NotifyService } from '@src/app/core/service/notify.service';
import { ResponseObject } from '@src/app/core/model/response-object';

import { TermService } from './term.service';
import { DataDomainService } from './data-domain.service';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { NzCrudButtonGroup } from '@src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface HtmlSelectOption {
  label: string;
  value: string | number;
  [key: string]: any;
}

export interface TermFormData {
  term: string | null;
  termEng: string | null;
  definition: string | null;
  status: string | null;
  system: string[] | null;
  columnName: string | null;
  dataDomainId: string | null;
  domainName?: string | null;
  comment: string | null;
}

export interface DataDomain {
  domainId: string | null;
  database: string | null;
  domainName: string | null;
  dataType: string | null;
  comment: string | null;
}


@Component({
  selector: 'term-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,

    NzCrudButtonGroup
  ],
  template: `
    <!-- ERROR TEMPLATE-->
    <ng-template #errorTpl let-control>
      @if (control.hasError('required')) {
        필수 입력 값입니다.
      }
    </ng-template>

    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <nz-form-item>
        <nz-form-label nzFor="term" nzRequired>용어</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="term" formControlName="term" required/>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="termEng">용어(영문)</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="termEng" formControlName="termEng"
            placeholder="용어(영문)를 입력해주세요."/>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="definition">정의</nz-form-label>
        <nz-form-control>
          <textarea nz-input id="definition" formControlName="definition"
            placeholder="설명을 입력해주세요." [rows]="10">
          </textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="dataDomainId" nzRequired>도메인</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <nz-select nzId="dataDomainId" formControlName="dataDomainId" >
            @for (option of dataDomainList(); track option) {
              <nz-option
                [nzLabel]="option.domainName"
                [nzValue]="option.domainId">
              </nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="columnName" nzRequired>컬럼명</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="columnName" formControlName="columnName" required/>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="system" nzRequired>시스템</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <nz-select nzId="system" formControlName="system" nzMode="multiple">
            @for (option of systemTypeList(); track option) {
              <nz-option
                [nzLabel]="option.label"
                [nzValue]="option.value">
              </nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="comment">비고</nz-form-label>
        <nz-form-control>
          <textarea nz-input id="comment" formControlName="comment"
            placeholder="비고를 입력해주세요." [rows]="10">
          </textarea>
        </nz-form-control>
      </nz-form-item>

    </form>

    <!--
    <div class="footer">
      <app-nz-crud-button-group
        [searchVisible]="false"
        [isSavePopupConfirm]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove()">
      </app-nz-crud-button-group>
    </div>
          -->
  `,
  styles: [`
    .btn-group {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      padding-left: auto;
      padding-right: 5;
    }

    .footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
    }

  `]
})
export class TermForm implements OnChanges {
  //systemTypeList: any;
  //dataDomainList: DataDomain[] = [];

  systemTypeList = signal<HtmlSelectOption[]>([]);
  dataDomainList= signal<DataDomain[]>([]);

  private service = inject(TermService);
  private dataDomainService = inject(DataDomainService);
  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    term         : new FormControl<string | null>(null, { validators: Validators.required }),
    termEng      : new FormControl<string | null>(null),
    definition   : new FormControl<string | null>(null),
    status       : new FormControl<string | null>(null),
    system       : new FormControl<string[] | null>(null, { validators: Validators.required }),
    columnName   : new FormControl<string | null>(null),
    dataDomainId : new FormControl<string | null>(null),
    comment      : new FormControl<string | null>(null)
  });

  formDataId = input<string>('');

  constructor() {
    this.getSystemTypeList();
    this.getDataDoaminList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.formDataId() === '') {
      this.newForm();
    } else {
      this.get(this.formDataId());
    }
  }

  focusInput() {
    //this.renderer.selectRootElement('#termId').focus();
  }

  newForm() {
    this.fg.reset();
    this.fg.controls.term.enable();

    this.focusInput();
  }

  modifyForm(formData: TermFormData) {
    this.fg.controls.term.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string) {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<TermFormData>) => {
            if ( model.data ) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
          }
        );
  }

  save() {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<TermFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove() {
    this.service
        .delete(this.fg.controls.term.value!)
        .subscribe(
          (model: ResponseObject<TermFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getSystemTypeList() {
    this.service
        .getSystemTypeList()
        .subscribe(
          (model: ResponseList<any>) => {
            if (model.data) {
              this.systemTypeList.set(model.data);
            }

          }
        );
  }

  getDataDoaminList() {
    this.dataDomainService
        .getList()
        .subscribe(
          (model: ResponseList<DataDomain>) => {
            if (model.data) {
              this.dataDomainList.set(model.data);
            }
          }
        );
  }

}
