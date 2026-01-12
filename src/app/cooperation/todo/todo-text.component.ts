import { Component, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { NzIconModule } from 'ng-zorro-antd/icon';

export interface TodoModel {
  groupId: string;
  todoId: string;
  completed: boolean;
  todo: string;
}

@Component({
  selector: 'todo-text',
  imports: [CommonModule, FormsModule, NzCheckboxModule, NzButtonModule, NzIconModule],
  template: `
    <label nz-checkbox [(ngModel)]="todo().completed" (change)="changeState()"></label>
    <label (click)="toggleState()" [class.line-break]="todo().completed"> {{ todo().todo }} </label>
    <button nz-button nzType="primary" nzDanger (click)="deleteTodo()"><span nz-icon nzType="delete" nzTheme="outline"></span></button>
  `,
  styles: `
    :host {
      padding-left: 5px;
      display: block;
      /*padding: 16px;*/
      color: darkgray;
      background-color: white;
    }

    .line-break {
      text-decoration: line-through;
    }
  `
})
export class TodoTextComponent {

  todo = model.required<TodoModel>();

  stateChanged = output<any>();
  deleteClicked = output<TodoModel>();

  constructor() {}

  changeState() {
    this.stateChanged.emit(this.todo());
  }

  toggleState() {
    this.stateChanged.emit(this.todo());
  }

  deleteTodo() {
    this.deleteClicked.emit(this.todo());
  }


}
