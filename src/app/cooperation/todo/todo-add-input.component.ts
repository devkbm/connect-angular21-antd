import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';

export interface TodoModel {
  groupId: string;
  todoId: string;
  completed: boolean;
  todo: string;
}


@Component({
  selector: 'todo-add-input',
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule
  ],
  template: `
    <button nz-button (click)="addTodo(newText())">add</button>
    <input nz-input placeholder="입력해주세요." [(ngModel)]="newText" (keyup.enter)="addTodo(newText())">
  `,
  styles: [`
    :host {
      display: flex;
      background-color: grey;
      align-items: stretch;
    }
  `]
})
export class TodoAddInputComponent {

  pkTodoGroup = input.required<string>();
  onTodoAdded = output<TodoModel>();

  newText = model<string>('');

  constructor() {
    this.newText.set('');
  }

  addTodo(newText: string) {
    const obj: TodoModel = {groupId: this.pkTodoGroup(), todoId: '', completed: false, todo: newText};
    this.onTodoAdded.emit(obj);
    this.newText.set('');
  }

}
