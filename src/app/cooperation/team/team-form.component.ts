import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { TeamService } from './team.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';

import { NzSelectModule } from 'ng-zorro-antd/select';

export interface TeamModel {
  teamId: string | null;
  teamName: string | null;
  memberList: string[] | null;
}

export interface TeamJoinableUserModel {
  userId: string;
  userName: string;
}

export interface Team {
  teamId: string;
  teamName: string;
  memberList: string[];
}


@Component({
  selector: 'team-form',
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
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="teamId" nzRequired>팀ID</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="teamId" formControlName="teamId" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="teamName" nzRequired>팀명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="teamName" formControlName="teamName" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="memberList" nzRequired>팀원</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="memberList" formControlName="memberList" nzMode="multiple">
                @for (option of members; track option) {
                  <nz-option
                    [nzLabel]="option.userName"
                    [nzValue]="option.userId">
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>
    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [searchVisible]="false"
        [isSavePopupConfirm]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove()">
      </app-nz-crud-button-group>
    </div>
  `,
  styles: [`
    [nz-button] {
      margin-right: 8px;
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
export class TeamFormComponent implements OnInit, AfterViewInit, OnChanges {
  //teamName = viewChild.required<NzInputTextComponent>('teamName');

  members: TeamJoinableUserModel[] = [];

  private service = inject(TeamService);
  private notifyService = inject(NotifyService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    teamId      : new FormControl<string | null>(null, { validators: [Validators.required] }),
    teamName    : new FormControl<string | null>(null, { validators: [Validators.required] }),
    memberList  : new FormControl<string[] | null>(null)
  });

  formDataId = input<string>('');

  ngOnInit() {
    this.getMembers();

    if (this.formDataId()) {
      this.get(this.formDataId());
    } else {
      this.newForm();
    }
  }

  ngAfterViewInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  newForm(): void {
    this.fg.reset();

    this.fg.controls.teamId.disable();

  }

  modifyForm(formData: TeamModel): void {
    this.fg.controls.teamId.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<TeamModel>) => {
            if (model.data) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
            this.notifyService.changeMessage(model.message);
          }
        );
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

    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<TeamModel>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.service
        .remove(this.fg.getRawValue().teamId!)
        .subscribe(
          (model: ResponseObject<TeamModel>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getMembers() {
    this.service
        .getAllUserList()
        .subscribe(
          (model: ResponseList<TeamJoinableUserModel>) => {
            this.members = model.data;
          }
        )
  }

}
