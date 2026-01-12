import { Component, inject, OnInit, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ContextMenuComponent, ContextMenuModule, ContextMenuService } from '@perfectmemory/ngx-contextmenu';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface TodoGroupModel {
  groupId: string;
  todoGroupName: string;
  isSelected: boolean;
}


@Component({
  selector: 'todo-group-list',
  imports: [
    CommonModule,
    FormsModule,
    ContextMenuModule,
    NzButtonModule,
    NzCheckboxModule
  ],
  template: `
    <button nz-button (click)="addTodoGroup()" style="width:100%">그룹 추가</button>

    @for (todoGroup of todoGroupList; track todoGroup.groupId) {
      <div
        [contextMenu]="basicMenu()" [contextMenuValue]="todoGroup"
        (click)="selectTodoGroup(todoGroup.groupId)">
        {{todoGroup.todoGroupName}}
        <label nz-checkbox [(ngModel)]="todoGroup.isSelected" (ngModelChange)="selectTodoGroup(todoGroup.groupId)" ></label>
      </div>

      <context-menu menuClass="custom-style">
        <ng-template contextMenuItem let-value [passive]="true"
          (execute)="showMessage('Hi, someone', $event.value.groupId)">

          <input #rename value="{{value.todoGroupName}}" (keydown.enter)="renameTodoGroup(value, rename.value)"/>
          <button (click)="renameTodoGroup(value, rename.value)">변경</button>
        </ng-template>
        <ng-template contextMenuItem let-value (execute)="onContextMenuAction2($event.value)">
        그룹 삭제
        </ng-template>
      </context-menu>
    }

    <!--
    <mat-selection-list #todoGroups [multiple]="false"  color="primary"
                        (selectionChange)="selectTodoGroup(todoGroups.selectedOptions.selected[0].value)">
      @for (todoGroup of todoGroupList; track todoGroup.pkTodoGroup) {
      <mat-list-option [value]="todoGroup.pkTodoGroup" [contextMenu]="basicMenu()" [contextMenuValue]="todoGroup">
        {{todoGroup.todoGroupName}}
      </mat-list-option>
      }
    </mat-selection-list>
    -->


    <!--
      input 텍스트박스가 사라져서 다른 방법을 찾고 있음

    <div style="visibility: hidden; position: fixed"
        [style.left]="contextMenuPosition.x"
        [style.top]="contextMenuPosition.y"
        [matMenuTriggerFor]="contextMenu">
    </div>
    <mat-menu #contextMenu="matMenu">
      <ng-template matMenuContent let-item="item" contextMenuItem="true">
        <div>
          <input value="{{item.pkTodoGroup}}"/><button mat-menu-item (click)="onContextMenuAction1(item)">Action 1</button>
        </div>
        <button mat-menu-item (click)="onContextMenuAction2(item)">그룹 삭제</button>
      </ng-template>
    </mat-menu>
    -->
  `,
  styles: [`
    .custom-style {
      /* Styling of the element where a context menu can appear */
      --ngx-contextmenu-focusable-border-bottom: 1px dotted #70757e;

      /* Styling of the context menu itself */
      --ngx-contextmenu-font-family: sans-serif;
      --ngx-contextmenu-background-color: white;
      --ngx-contextmenu-border-radius: 4px;
      --ngx-contextmenu-border: 1px solid rgba(0, 0, 0, 0.18);
      --ngx-contextmenu-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
      --ngx-contextmenu-font-size: 14px;
      --ngx-contextmenu-margin: 2px 0 0;
      --ngx-contextmenu-min-width: 160px;
      --ngx-contextmenu-outline: 1px solid #70757e;
      --ngx-contextmenu-padding: 5px 0;
      --ngx-contextmenu-text-color: #70757e;
      --ngx-contextmenu-text-disabled-color: #8a909a;
      --ngx-contextmenu-max-height: 100vh;

      /* Styling of context menu items */
      --ngx-contextmenu-item-arrow-left: '◀';
      --ngx-contextmenu-item-arrow-right: '▶';
      --ngx-contextmenu-item-background-hover-color: #f8f8f8;
      --ngx-contextmenu-item-separator-color: #8a909a;
      --ngx-contextmenu-item-separator-padding: 10px;
      --ngx-contextmenu-item-separator-width: 96%;
      --ngx-contextmenu-item-padding: 6px 20px;
      --ngx-contextmenu-item-text-hover-color: #5a6473;
    }
  `]
})
export class TodoGroupListComponent implements OnInit {

  onSelectedTodoGroup = output<any>();
  onDeletedTodoGroup = output<any>();

  todoGroupList: TodoGroupModel[] = [];

  //contextMenu = viewChild.required(MatMenuTrigger);
  contextMenuPosition = { x: '0px', y: '0px' };

  // https://perfectmemory.github.io/ngx-contextmenu/?path=/docs/context-menu-introduction--docs
  basicMenu = viewChild.required<ContextMenuComponent<any>>(ContextMenuComponent);

  private http = inject(HttpClient);
  private _contextMenuService = inject(ContextMenuService<any>);

  //constructor(private service: TodoService,  private _contextMenuService: ContextMenuService<any>) { }

  ngOnInit() {
    this.getTodoGroupList();
  }

  addTodoGroup(): void {
    const url = GlobalProperty.serverUrl() + `/api/todo/group/new`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<TodoGroupModel>>(url, null, options).pipe(
        //  catchError(this.handleError<ResponseObject<TodoGroupModel>>('newTodoGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<TodoGroupModel>) => {
            if (model === null || model === undefined) return;

            this.todoGroupList.push(model.data);
            this.onSelectedTodoGroup.emit(model.data.groupId);
          }
        );
  }

  getTodoGroupList(params?: any): void {
    const url = GlobalProperty.serverUrl() + `/api/todo/group/mylist`;
    const options = getHttpOptions(params);

    this.http.get<ResponseList<TodoGroupModel>>(url, options).pipe(
        //  catchError(this.handleError<ResponseList<TodoGroupModel>>('getMyTodogroupList', undefined))
        )
        .subscribe(
          (model: ResponseList<TodoGroupModel>) => {
            if (model === null || model === undefined) return;
            console.log(model);
            this.todoGroupList = model.data;
          }
        );
  }

  selectTodoGroup(pkTodoGroup: string): void {
    for (const todoGroup of this.todoGroupList) {
      // 선택되지 않은 TodoGroup 속성 변경
      /*
      if (todoGroup.pkTodoGroup === pkTodoGroup) {
        todoGroup.isSelected = true;
      } else {
        todoGroup.isSelected = false;
      }
      */
     // 선택되지 않은 TodoGroup 속성 변경
      todoGroup.groupId === pkTodoGroup ? todoGroup.isSelected = true : todoGroup.isSelected = false;
    }

    this.onSelectedTodoGroup.emit(pkTodoGroup);
  }

  deleteTodoGroup(pkTodoGroup: string): void {
    this.onDeletedTodoGroup.emit(pkTodoGroup);
  }

  onContextMenu(event: MouseEvent, item: TodoGroupModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';

    /*
    this.contextMenu().menuData = { 'item': item };
    this.contextMenu().menu?.focusFirstItem('mouse');
    this.contextMenu().openMenu();
    */
  }

  onContextMenuAction1(item: TodoGroupModel) {
    alert(`Click on Action 1 for ${item.groupId}`);
  }

  onContextMenuAction2(item: TodoGroupModel) {
    let index = this.todoGroupList.findIndex((e) => e.groupId === item.groupId);
    this.todoGroupList.splice(index, 1);

    this.deleteTodoGroup(item.groupId);
    //alert(`Click on Action 2 for ${item.pkTodoGroup}`);
  }

  public showMessage(message: any, data?: any): void {
    console.log(message, data);
  }

  renameTodoGroup(item: TodoGroupModel, name: string) {
    item.todoGroupName = name;

    const url = GlobalProperty.serverUrl() + `/api/todo/group`;
    const options = getHttpOptions();

    const obj = {pkTodoGroup: item.groupId, todoGroupName: name, isSelected: false};
    this.http.post<ResponseObject<TodoGroupModel>>(url, obj, options).pipe(
          //catchError(this.handleError<ResponseObject<TodoGroupModel>>('saveTodoGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<TodoGroupModel>) => {

          }
        )

    this._contextMenuService.closeAll();
  }
}
