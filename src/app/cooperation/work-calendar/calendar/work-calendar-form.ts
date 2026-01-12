import { Component, OnInit, AfterViewInit, inject, input, effect, Renderer2, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { SessionManager } from 'src/app/core/session-manager';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { NzInputNgxColors } from 'src/app/third-party/ngx-colors/nz-input-ngx-colors';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface WorkCalendarMember {
  workGroupId: string;
  userId: string;
}

export interface WorkCalendar {
  workCalendarId: string | null;
  workCalendarName: string | null;
  color: string | null;
  memberList: string[];
}


@Component({
  selector: 'work-calendar-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNgxColors,
  ],
  template: `
    {{fg.getRawValue() | json}}
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

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="workCalendarId" nzRequired>CALEDNAR ID</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="workCalendarId" formControlName="workCalendarId" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="workCalendarName" nzRequired>CALENDAR NAME</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="workCalendarName" formControlName="workCalendarName" required/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="color">색상</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-ngx-colors formControlName="color"
                [itemId]="'color'"
                [colorPalette]="preset_colors">
              </nz-input-ngx-colors>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
        <nz-form-item>
            <nz-form-label nzFor="memberList" nzRequired>팀원</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="memberList" formControlName="memberList" nzMode="tags">
                @for (option of memberList; track option) {
                  <nz-option
                    [nzLabel]="option.name"
                    [nzValue]="option.userId">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

    </form>
  `,
  styles: []
})
export class WorkCalendarForm implements OnInit {

  workGroupList: any;
  memberList: any;
  color: any;

  preset_colors = [
    '#335c67', '#6d597a', '#e09f3e', '#9e2a2b', '#540b0e',
    '#031d44', '#04395e', '#70a288', '#dab785', '#d5896f'
  ];

  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    workCalendarId    : new FormControl<string | null>({value: null, disabled: true}, { validators: [Validators.required] }),
    workCalendarName  : new FormControl<string | null>(null, { validators: [Validators.required] }),
    color             : new FormControl<string | null>(null),
    memberList        : new FormControl<any | null>(null)
  });

  formDataId = input<number>(-1);

  constructor() {
    this.getAllMember();

    effect(() => {
      if ( this.formDataId() > 0 ) {
        this.get(this.formDataId());
      }
    })
  }

  ngOnInit(): void {
    this.newForm();
  }

  focusInput() {
    this.renderer.selectRootElement('#workCalendarName').focus();
  }

  newForm(): void {
    this.fg.controls.memberList.setValue([SessionManager.getUserId()]);
    this.fg.controls.color.setValue(this.preset_colors[Math.floor(Math.random() * this.preset_colors.length)]);   // Calendar color random select
  }

  modifyForm(formData: WorkCalendar): void {
    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: number): void {
    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendar/${id}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<WorkCalendar>>(url, options).pipe(
        //    catchError(this.handleError<ResponseObject<WorkCalendar>>('getWorkGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendar>) => {
            if (model.data) {
              this.modifyForm(model.data);
              this.color = model.data.color;
            } else {
              this.newForm();
            }
          }
        )
  }

  save(): void {
    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendar`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<WorkCalendar>>(url, this.fg.getRawValue(), options).pipe(
        //    catchError(this.handleError<ResponseObject<WorkCalendar>>('getWorkGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendar>) => {
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const id: string = this.fg.controls.workCalendarId.value!;

    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendar/${id}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<WorkCalendar>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<WorkCalendar>>('deleteWorkGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendar>) => {
            this.formDeleted.emit(this.fg.getRawValue());
          }
      )
  }

  getAllMember(): void {
    const url =  GlobalProperty.serverUrl() + `/api/system/user`;
    const options = getHttpOptions();

    this.http.get<ResponseList<WorkCalendarMember>>(url, options).pipe(
        //  catchError(this.handleError<ResponseList<WorkCalendarMember>>('getMemberList', undefined))
        )
        .subscribe(
          (model: ResponseList<WorkCalendarMember>) => {
            if (model.data) {
                this.memberList = model.data;
            } else {
                this.memberList = [];
            }
        }
      )
  }

  selectColor(color: any): void {
    this.fg.get('color')?.setValue(color);
  }

}
