import { Component, OnInit, inject, viewChild } from '@angular/core';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { TeamGridComponent } from './team-grid.component';
import { TeamService } from './team.service';

import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { TeamFormComponent } from './team-form.component';


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
  selector: 'team-app',
  imports: [
    CommonModule,
    NzButtonModule,
    NzDrawerModule,
    NzDividerModule,

    TeamFormComponent,
    TeamGridComponent,
    NzPageHeaderCustom
  ],
  template: `
<nz-page-header-custom title="팀 정보" subtitle="팀 정보 관리"></nz-page-header-custom>

<div nz-row class="btn-group">
  <button nz-button (click)="getGridList('d')">
    <span nz-icon nzType="search"></span>조회
  </button>

  <nz-divider nzType="vertical"></nz-divider>

  <button nz-button (click)="newTeam()">
    <span nz-icon nzType="form"></span>팀등록
  </button>
</div>

<div style="height:300px">
  @defer {
  <team-grid [data]="gridList"
    (editButtonClicked)="editTeam($event)"
    (rowDoubleClicked)="editTeam($event)">
  </team-grid>
  }
</div>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="800"
    [nzVisible]="drawer.team.visible"
    nzTitle="코드분류 등록"
    (nzOnClose)="drawer.team.visible = false">

    <team-form *nzDrawerContent
      [formDataId]="drawer.team.formDataId"
      (formSaved)="getGridList('d')"
      (formDeleted)="getGridList('d')"
      (formClosed)="drawer.team.visible = false">
    </team-form>
    <!--
    <hrm-code-type-form #formHrmType *nzDrawerContent
      [initLoadId]="drawerCodeType.initLoadId"
      (formSaved)="getGridHrmCodeType()"
      (formDeleted)="getGridHrmCodeType()"
      (formClosed)="drawerCodeType.visible = false">
    </hrm-code-type-form>
    -->
</nz-drawer>

  `,
  styles: `
.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.content {
  height: calc(100% - 124px);
  display: grid;
  grid-template-rows: 34px 1fr 34px 1fr;
  grid-template-columns: 1fr;
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

  `
})
export class TeamApp implements OnInit {

  private notifyService = inject(NotifyService);
  private service = inject(TeamService);

  grid = viewChild.required(TeamGridComponent);

  drawer: {
    team: { visible: boolean, formDataId: string },
  } = {
    team: { visible: false, formDataId: '' }
  }

  gridList: TeamModel[] = [];

  ngOnInit() {
    this.getGridList('');
  }

  newTeam() {
    this.drawer.team.formDataId = '';
    this.drawer.team.visible = true;
  }

  editTeam(team: any) {
    this.drawer.team.formDataId = team.teamId;
    this.drawer.team.visible = true;
  }

  getGridList(typeId: string): void {
    this.drawer.team.visible = false;

    const params = {
    //  typeId : typeId
    };

    this.service
        .getList(params)
        .subscribe(
          (model: ResponseList<TeamModel>) => {
            this.gridList = model.data;
            this.notifyService.changeMessage(model.message);
          }
        );
  }

}
