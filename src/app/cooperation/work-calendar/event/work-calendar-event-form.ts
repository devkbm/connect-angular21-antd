import { Component, OnInit, OnChanges, SimpleChanges, inject, input, signal, Renderer2, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { pairwise } from 'rxjs';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface WorkCalendar {
  id: string | null;
  name: string | null;
  color: string | null;
  memberList: string[];
}

export interface WorkCalendarEvent {
  id: string | null;
  text: string | null;
  start: string | Date | null;
  end: string | Date | null;
  allDay: boolean | null;
  workCalendarId: string | null;
  color?: string;
}

export interface NewFormValue {
  workCalendarId: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

@Component({
  selector: 'work-calendar-event-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzSwitchModule,
    NzIconModule,
    NzSelectModule,
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
      </ng-template>

      <!-- 1 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="workCalendarId" nzRequired>작업그룹 ID</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="workCalendarId" formControlName="workCalendarId">
                @for (option of workGroupList(); track option) {
                  <nz-option
                    [nzLabel]="option.name"
                    [nzValue]="option.id">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item>
            <nz-form-label nzFor="id" nzRequired>일정ID</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="id" formControlName="id" required
                placeholder="일정ID를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="10">
          <nz-form-item>
            <nz-form-label nzFor="start" nzRequired>시작일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              @if (this.fg.value.allDay) {
                <nz-date-picker nzId="start" formControlName="start" required></nz-date-picker>
              } @else {
                <nz-date-picker
                  nzId="start" formControlName="start" required
                  nzShowTime nzFormat="yyyy-MM-dd HH:mm:ss" nzPlaceHolder="Start"
                ></nz-date-picker>
              }
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="10">
          <nz-form-item>
            <nz-form-label nzFor="end" nzRequired>종료일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              @if (this.fg.value.allDay) {
                <nz-date-picker nzId="end" formControlName="end" required></nz-date-picker>
              } @else {
                <nz-date-picker
                  nzId="end" formControlName="end" required
                  nzShowTime nzFormat="yyyy-MM-dd HH:mm:ss" nzPlaceHolder="End"
                ></nz-date-picker>
              }
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item>
            <nz-form-label nzFor="useYn">종일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <!--<label nz-checkbox nzId="allDay" formControlName="allDay" (ngModelChange)="allDayCheck($event)"></label>-->
              <nz-switch nzId="allDay" formControlName="allDay"
                    [nzCheckedChildren]="checkedTemplate"
                    [nzUnCheckedChildren]="unCheckedTemplate">
                  <ng-template #checkedTemplate><span nz-icon nzType="check"></span></ng-template>
                  <ng-template #unCheckedTemplate><span nz-icon nzType="close"></span></ng-template>
              </nz-switch>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <nz-form-item>
        <nz-form-label nzFor="text">제목</nz-form-label>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <textarea nz-input id="text" formControlName="text"
            placeholder="제목을 입력해주세요." [rows]="10">
          </textarea>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styles: []
})
export class WorkCalendarEventForm implements OnInit, OnChanges {

  newFormValue = input<NewFormValue>();

  workGroupList = signal<WorkCalendar[]>([]);

  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    id              : new FormControl<string | null>(null, { validators: [Validators.required] }),
    text            : new FormControl<string | null>(null, { validators: [Validators.required] }),
    start           : new FormControl<string | Date | null>(new Date()),
    end             : new FormControl<string | Date | null>(new Date()),
    allDay          : new FormControl<boolean | null>(null),
    workCalendarId  : new FormControl<string | null>(null, { validators: [Validators.required] })
  });

  formDataId = input<string>('');

  constructor() {

    this.fg.controls.start.valueChanges.pipe(pairwise()).subscribe(([prev, next]: [any, any]) => {

      if (this.fg.value.allDay === true && prev !== next) {
        let date = new Date(next);
        this.removeTime(date);
        this.fg.controls.start.setValue(formatDate(date,'yyyy-MM-ddTHH:mm:ss.SSS','ko-kr'));
      } else if (prev !== next) {
        let date = new Date(next);
        this.fg.controls.start.setValue(formatDate(date,'yyyy-MM-ddTHH:mm:ss.SSS','ko-kr'));
      }
    });

    this.fg.controls.end.valueChanges.pipe(pairwise()).subscribe(([prev, next]: [any, any]) => {
      if (this.fg.value.allDay === true && prev !== next) {
        let date = new Date(next);
        this.removeTime(date);
        this.fg.controls.end.setValue(formatDate(date,'yyyy-MM-ddTHH:mm:ss.SSS','ko-kr'));
      } else if (prev !== next) {
        let date = new Date(next);
        this.fg.controls.end.setValue(formatDate(date,'yyyy-MM-ddTHH:mm:ss.SSS','ko-kr'));
      }
    });
  }

  // 시분초 제거
  removeTime(date: Date): Date {

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  ngOnInit(): void {
    this.getMyWorkGroupList();

    if (this.formDataId()) {
      this.get(this.formDataId());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.newFormValue()) {
      this.newForm(this.newFormValue()!);
    }
  }

  focusInput() {
    this.renderer.selectRootElement('#text').focus();
  }

  newForm(params: NewFormValue): void {
    // 30분 단위로 입력받기 위해 초,밀리초 초기화
    params.start.setSeconds(0);
    params.start.setMilliseconds(0);
    params.end.setSeconds(0);
    params.end.setMilliseconds(0);

    this.fg.reset();

    let calendarId = Array.isArray(params.workCalendarId) ? params.workCalendarId[0] : params.workCalendarId;
    this.fg.controls.workCalendarId.setValue(calendarId);

    this.fg.controls.start.setValue(formatDate(params.start,'yyyy-MM-ddTHH:mm:ss.SSS','ko-kr'));
    this.fg.controls.end.setValue(formatDate(params.end,'yyyy-MM-ddTHH:mm:ss.SSS','ko-kr'));

    this.fg.controls.allDay.setValue(params.allDay);

    this.fg.controls.id.disable();
    this.focusInput();
  }

  modifyForm(formData: WorkCalendarEvent): void {
    this.fg.patchValue(formData);

    this.fg.controls.id.disable({onlySelf: false, emitEvent: true});
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendarevent/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<WorkCalendarEvent>>(url, options)
        .pipe(
            //catchError(this.handleError<ResponseObject<WorkCalendarEvent>>('getWorkGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendarEvent>) => {
            if (model.data) {
              this.modifyForm(model.data);
            }
          }
        )
  }

  save(): void {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendarevent`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<WorkCalendarEvent>>(url, this.fg.getRawValue(), options).pipe(
            //catchError(this.handleError<ResponseObject<WorkCalendarEvent>>('saveWorkGroupSchedule', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendarEvent>) => {
            this.formSaved.emit(this.fg.getRawValue());
          }
      )
  }

  remove(): void {
    const id = this.fg.controls.id.value!;

    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendarevent/${id}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<WorkCalendarEvent>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<WorkCalendarEvent>>('deleteWorkGroupSchedule', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendarEvent>) => {
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

  getMyWorkGroupList(): void {
    const url =  GlobalProperty.serverUrl() + `/api/grw/myworkcalendar`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<WorkCalendar>>(url, options).pipe(
            //catchError(this.handleError<ResponseList<WorkCalendar>>('getMyWorkGroupList', undefined))
        )
        .subscribe(
          (model: ResponseList<WorkCalendar>) => {
            this.workGroupList.set(model.data);
            //this.notifyService.changeMessage(model.message);
          }
        )
  }

}
