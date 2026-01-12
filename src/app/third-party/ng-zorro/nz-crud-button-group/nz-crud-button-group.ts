import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, input, output } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-nz-crud-button-group',
  imports: [
    CommonModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    NzPopconfirmModule,
    NzSpaceModule
  ],
  template:`
    <nz-space [nzSplit]="spaceSplit" [nzSize]="8">
    <ng-template #spaceSplit>
      <nz-divider nzType="vertical"></nz-divider>
    </ng-template>

      @if (searchVisible()) {
        <button nz-button (click)="searchButtonClick($event)">
          <span nz-icon nzType="search"></span>
          조회
        </button>
      }

      @if (saveVisible()) {
        @if (isSavePopupConfirm()) {
          <!--저장 재확인할 경우 -->
          <button nz-button nzType="primary" *nzSpaceItem
                  nz-popconfirm nzPopconfirmTitle="저장하시겠습니까?"
                  (nzOnConfirm)="saveButtonClick()" (nzOnCancel)="false">
            <span nz-icon nzType="save" nzTheme="outline"></span>저장
          </button>
        } @else {
          <!--저장 재확인하지 않을 경우 -->
          <button nz-button nzType="primary" *nzSpaceItem
            (click)="saveButtonClick()">
            <span nz-icon nzType="save" nzTheme="outline"></span>저장
          </button>
        }
      }

      @if (deleteVisible()) {
        @if (isDeletePopupConfirm()) {
        <!--삭제 재확인할 경우 -->
        <button  nz-button nzDanger *nzSpaceItem
          nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
          (nzOnConfirm)="deleteButtonClick()" (nzOnCancel)="false">
          <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>
        } @else {
        <!--삭제 재확인하지 않을 경우 -->
        <button nz-button nzDanger *nzSpaceItem (click)="deleteButtonClick()">
          <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>
        }
      }

      <button nz-button *nzSpaceItem (click)="closeButtonClick($event)">
        <span nz-icon nzType="form" nzTheme="outline"></span>
        닫기
      </button>

    </nz-space>
  `,
  styles: `
    .select_button {
      background-color: green;
    }
  `
})
export class NzCrudButtonGroup implements OnInit {

  isSavePopupConfirm = input<boolean>(true);
  isDeletePopupConfirm = input<boolean>(true);

  searchVisible = input<boolean>(true);
  saveVisible = input<boolean>(true);
  deleteVisible = input<boolean>(true);

  searchClick = output<any>();
  saveClick = output<any>();
  deleteClick = output<any>();
  closeClick = output<any>();

  ngOnInit(): void {
  }

  searchButtonClick(event: any) {
    this.searchClick.emit(event);
  }

  //@HostListener('window:keydown.alt.s', ['$event'])
  saveHotKeyClick(event: KeyboardEvent) {
    event.preventDefault();
    this.saveClick.emit(event);
  }

  saveButtonClick() {
    this.saveClick.emit('');
  }

  //@HostListener('window:keydown.alt.r', ['$event'])
  deleteButtonClick() {
    this.deleteClick.emit('');
  }

  //@HostListener('window:keydown.alt.q', ['$event'])
  closeButtonClick(event: any) {
    this.closeClick.emit(event);
  }

}
