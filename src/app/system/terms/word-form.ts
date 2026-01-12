import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild, Renderer2, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { WordService } from './word.service';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';


export interface WordFormData {
  logicalName: string | null;
  logicalNameEng: string | null;
  physicalName: string | null;
  comment: string | null;
}


@Component({
  selector: 'word-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,

    NzCrudButtonGroup
  ],
  template: `
    {{formDataId | json}} - {{fg.getRawValue() | json}} - {{fg.valid}}
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
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="logicalName" nzRequired>logicalName</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="logicalName" formControlName="logicalName" required
                placeholder="logicalName을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="physicalName" nzRequired>physicalName</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="physicalName" formControlName="physicalName" required
                placeholder="physicalName 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="logicalNameEng">logicalNameEng</nz-form-label>
            <nz-form-control>
              <input nz-input id="logicalNameEng" formControlName="logicalNameEng"
                placeholder="logicalNameEng 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="comment">비고</nz-form-label>
            <nz-form-control>
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
export class WordForm implements OnInit, AfterViewInit, OnChanges {

  private service = inject(WordService);
  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    logicalName     : new FormControl<string | null>(null, { validators: Validators.required }),
    physicalName    : new FormControl<string | null>(null, { validators: Validators.required }),
    logicalNameEng  : new FormControl<string | null>(null),
    comment         : new FormControl<string | null>(null)
  });

  formDataId = input<string>('');

  ngOnInit() {
    if (this.formDataId()) {
      this.get(this.formDataId());
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  focusInput() {
    this.renderer.selectRootElement('#code').focus();
  }

  newForm() {

    this.fg.controls.logicalName.enable();
    this.fg.controls.physicalName.enable();

    this.focusInput();
  }

  modifyForm(formData: WordFormData) {

    this.fg.controls.logicalName.disable();
    this.fg.controls.physicalName.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string) {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<WordFormData>) => {
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
          (model: ResponseObject<WordFormData>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        );
  }

  remove() {
    this.service
        .delete(this.fg.controls.logicalName.value!)
        .subscribe(
          (model: ResponseObject<WordFormData>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        );
  }

}
