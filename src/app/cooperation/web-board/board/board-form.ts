import { AfterViewInit, Component, OnInit, Renderer2, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { sequenceEqual } from 'rxjs';

export interface BoardManagement {
  boardId: string | null;
  boardParentId: string | null;
  boardName: string | null;
  boardType: string | null;
  boardDescription: string | null;
}

export interface BoardHierarchy {
  createdDt: Date;
  createdBy: string;
  modifiedDt: Date;
  modifiedBy: string;
  boardId: string;
  boardParentId: string;
  boardName: string;
  boardDescription: string;
  fromDate: Date;
  toDate: Date;
  articleCount: number;
  sequence: number;
  selected: boolean;
  expanded: boolean;
  isLeaf: boolean;
  active: boolean;
  children: BoardHierarchy[];
  title: string;
  key: string;
}


@Component({
  selector: 'board-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzTreeSelectModule,
    NzSelectModule,
],
  template: `
    <div>{{fg.getRawValue() | json}}</div>

    <!--
    <button nz-button (click)="get(this.fg.value.boardId!)">
      <span nz-icon nzType="search"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
-->
    <button nz-button (click)="newForm()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzType="primary" (click)="save()">
      <span nz-icon nzType="save" nzTheme="outline"></span>저장
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <!--
    <button nz-button (click)="closeForm()">
      <span nz-icon nzType="form" nzTheme="outline"></span>닫기
    </button>
-->
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzDanger (click)="remove()">
      <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
    </button>

    <!-- ERROR TEMPLATE-->
    <ng-template #errorTpl let-control>
      @if (control.hasError('required')) {
        필수 입력 값입니다.
      }
    </ng-template>

    <form nz-form [formGroup]="fg" nzLayout="vertical" #form>
      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="boardId">게시판ID</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="boardId" formControlName="boardId"
                placeholder="신규"
              />
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="boardType" nzRequired>게시판타입</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="boardType" formControlName="boardType">
                @for (option of boardTypeList; track option) {
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
            <nz-form-label nzFor="boardParentId">상위 게시판</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-tree-select
                nzId="boardParentId"
                formControlName="boardParentId"
                [nzNodes]="parentBoardItems"
                nzPlaceHolder="상위 게시판 없음"
                >
              </nz-tree-select>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="boardName" nzRequired>게시판 명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="boardName" formControlName="boardName" required
                placeholder="게시판명을 입력해주세요."
              />
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="boardDescription">게시판 설명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="boardDescription" formControlName="boardDescription"
                placeholder="게시판 설명을 입력해주세요." [rows]="20"
              >
              </textarea>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>

    <!--
    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (searchClick)="get(this.fg.value.boardId!)"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove()">
      </app-nz-crud-button-group>
    </div>
    -->
  `,
  styles: [`
    [nz-button] {
        margin-right: 8px;
    }

    .btn-group {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
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
export class BoardForm implements OnInit, AfterViewInit {

  parentBoardItems: BoardHierarchy[] = [];

  boardTypeList: any;

  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    boardId         : new FormControl<string | null>({value: '', disabled: true}),
    boardParentId   : new FormControl<string | null>(null),
    boardName       : new FormControl<string | null>('', { validators: [Validators.required] }),
    boardType       : new FormControl<string | null>('', { validators: [Validators.required] }),
    boardDescription: new FormControl<string | null>(null),
    sequence        : new FormControl<number | null>(0)
  });

  formDataId = input<any>();

  constructor() {
    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId());
      } else {
        this.newForm();
      }
    })
  }

  ngOnInit() {
    this.getboardHierarchy();
    this.getBoardTypeList();
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  focusInput() {
    this.renderer.selectRootElement('#boardName').focus();
  }

  newForm(): void {
    this.fg.reset();
    this.fg.controls.boardType.setValue('BOARD');
    this.fg.controls.sequence.setValue(0);

    this.focusInput();
  }

  modifyForm(formData: BoardManagement): void {
    //this.fg.controls.boardId.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/grw/board/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<BoardManagement>>(url, options)
        .pipe(
            //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<BoardManagement>) => {
            if (model.data) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
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

    const url = GlobalProperty.serverUrl() + `/api/grw/board`;
    const options = getHttpOptions();
    this.http
        .post<ResponseObject<BoardManagement>>(url, this.fg.getRawValue(), options)
        .pipe(
    //      catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<BoardManagement>) => {
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl() + `/api/grw/board/${this.fg.controls.boardId.value}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<BoardManagement>>(url, options)
        .pipe(
    //      catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<BoardManagement>) => {
            console.log(model);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

  getboardHierarchy(): void {
    const url = GlobalProperty.serverUrl() + `/api/grw/boardHierarchy`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<BoardHierarchy>>(url, options)
        .pipe(
          //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseList<BoardHierarchy>) => {
            model.data ? this.parentBoardItems = model.data : this.parentBoardItems = [];
            //this.notifyService.changeMessage(model.message);
            // title 노드 텍스트
            // key   데이터 키
            // isLeaf 마지막 노드 여부
            // checked 체크 여부
          }
        )
  }

  getBoardTypeList(): void {
    const url = GlobalProperty.serverUrl() + `/api/grw/board/boardType`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<any>>(url, options)
        .pipe(
        //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<any>) => {
            this.boardTypeList = model.data;
          }
        )
  }

}
