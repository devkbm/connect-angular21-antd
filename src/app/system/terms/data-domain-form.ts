import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild, Renderer2, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { DataDomainService } from './data-domain.service';

import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface HtmlSelectOption {
  label: string;
  value: string | number;
  [key: string]: any;
}

export interface DataDomainFormData {
  domainId: string | null;
  database: string | null;
  domainName: string | null;
  dataType: string | null;
  comment: string | null;
}



@Component({
  selector: 'data-domain-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzCrudButtonGroup,
  ],
  template: `
    {{fg.getRawValue() | json}}
    {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <!-- 1 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="domainId" nzRequired>도메인ID</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="domainId" formControlName="domainId" required
                placeholder="도메인Id를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="database" nzRequired>database</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="database" formControlName="database">
                @for (option of databaseList; track option) {
                  <nz-option
                    [nzLabel]="option.label"
                    [nzValue]="option.value">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="domainName" nzRequired>도메인명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="domainName" formControlName="domainName" required
                placeholder="도메인명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="dataType" nzRequired>dataType</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="dataType" formControlName="dataType" required
                placeholder="dataType을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="comment">비고</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="비고를 입력해주세요." [rows]="10">
              </textarea>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove()">
      </app-nz-crud-button-group>
    </div>

  `,
  styles: [``]
})
export class DataDomainForm implements OnInit, AfterViewInit, OnChanges {

  databaseList: HtmlSelectOption[] = [];

  private service = inject(DataDomainService);
  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    domainId      : new FormControl<string | null>(null, { validators: Validators.required }),
    domainName    : new FormControl<string | null>(null, { validators: Validators.required }),
    database      : new FormControl<string | null>(null, { validators: Validators.required }),
    dataType      : new FormControl<string | null>(null),
    comment       : new FormControl<string | null>(null)
  });

  formDataId = input<string>('');

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    this.getDatabaseList();

    if (this.formDataId()) {
      this.get(this.formDataId());
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  focusInput() {
    this.renderer.selectRootElement('#domainId').focus();
  }

  newForm() {
    this.fg.controls.database.enable();
    this.fg.controls.domainName.enable();

    this.fg.controls.domainName.setValue('MYSQL');

    this.focusInput();
  }

  modifyForm(formData: DataDomainFormData) {
    this.fg.controls.database.disable();
    this.fg.controls.domainName.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string) {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<DataDomainFormData>) => {
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
          (model: ResponseObject<DataDomainFormData>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        );
  }

  remove() {
    this.service
        .delete(this.fg.controls.domainId.value!)
        .subscribe(
          (model: ResponseObject<DataDomainFormData>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        );
  }

  getDatabaseList() {
    this.service
        .getDatabaseList()
        .subscribe(
          (model: ResponseList<HtmlSelectOption>) => {
            this.databaseList = model.data;
          }
        );
  }
}
