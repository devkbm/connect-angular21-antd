import { AfterViewInit, Component, ViewContainerRef, inject, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { BoardTree } from './board/board-tree';

import { PostForm } from './post/post-form';
import { PostView } from './post/post-view';
import { PostGrid } from './post/post-grid';
import { PostList, PostListData } from './post/post-list';

import { WindowRef } from 'src/app/core/window-ref';

export interface TabInfo {
  tabName: string;
  postId: string;
}

@Component({
  selector: 'board-app',
  imports: [
    FormsModule,
    ReactiveFormsModule,

    NzButtonModule,
    NzDrawerModule,
    NzTabsModule,
    NzInputModule,
    NzGridModule,
    NzTreeModule,
    NzDividerModule,
    NzIconModule,

    //ArticleGridComponent,
    BoardTree,
    PostView,
    PostForm,
    PostList
    //BoardFormComponent,
    //BoardManagementComponent,

  ],
  template: `
<div nz-row>
  <div nz-col [nzXs]="12" [nzSm]="12">

  </div>
  <div nz-col style="text-align: right" [nzXs]="12" [nzSm]="12">
    <button nz-button (click)="getBoardTree()">
      <span nz-icon nzType="search" nzTheme="outline"></span>조회
    </button>
    <button nz-button (click)="newPost()">
      <span nz-icon nzType="form" nzTheme="outline"></span>게시글 등록
    </button>
  </div>
</div>

<div class="tree">
  <h3 class="pgm-title">게시판 목록</h3>
  <nz-input-search>
    <input type="text" [(ngModel)]="queryValue" nz-input placeholder="input search text">
  </nz-input-search>

  <board-tree id="boardTree" #boardTree
    [searchValue]="queryValue"
    (itemSelected)="setBoardSelect($event)">
  </board-tree>
</div>


<nz-tabs [(nzSelectedIndex)]="tabIndex" nzType="editable-card" nzHideAdd (nzClose)="closeTab($event)">
  <nz-tab [nzTitle]="tabTitle">
    <post-list
      [boardId]="drawer.board.formDataId"
      (editClicked)="editPost($event)"
      (viewClicked)="viewPost($event)">
    </post-list>
  </nz-tab>
  @for (tab of tabs; track tab.postId) {
  <nz-tab [nzClosable]="$index >= 0" [nzTitle]="tab.tabName">
    <post-view [postId]="tab.postId">
    </post-view>
  </nz-tab>
  }
</nz-tabs>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="'80%'"
    [nzVisible]="drawer.postForm.visible"
    nzTitle="게시글 등록"
    (nzOnClose)="drawer.postForm.visible = false">
    <post-form #articleForm *nzDrawerContent
      [boardId]="drawer.postForm.boardId"
      [formDataId]="this.drawer.postForm.formDataId"
      (formSaved)="getArticleGridData()"
      (formDeleted)="getArticleGridData()"
      (formClosed)="drawer.postForm.visible = false">
    </post-form>
</nz-drawer>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="800"
    [nzVisible]="drawer.postView.visible"
    nzTitle="게시글 조회"
    (nzOnClose)="drawer.postView.visible = false">
    <post-view [id]="drawer.postView.id" *nzDrawerContent>
    </post-view>
</nz-drawer>


  `,
  styles: `
.content {
  height: calc(100vh - 140px);
  display: grid;
  grid-template-rows: 24px 1fr;
  grid-template-columns: 200px 1fr;
}

.grid {
  height: calc(100vh - 200px);
}

.tree {
  width: 200px;
  height: calc(100vh - 140px);
  float: left;
  margin-right: 8px;
  overflow: auto;
  /*background-color:burlywood*/
}

:host ::ng-deep .ck-editor__editable {
  min-height: 700px !important;
}

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.ime {
  -webkit-ime-mode:active;
  -moz-ime-mode:active;
  -ms-ime-mode:active;
  ime-mode:active;
}

  `
})
export class BoardApp implements AfterViewInit {

  boardTree = viewChild.required(BoardTree);
  postGrid = viewChild.required(PostGrid);
  postList =  viewChild.required(PostList);

  drawer: {
    board: { visible: boolean, formDataId: any },
    postForm: { visible: boolean, boardId: string, formDataId: any },
    postView: { visible: boolean, id: any, title: string }
  } = {
    board: { visible: false, formDataId: null },
    postForm: { visible: false, boardId: '', formDataId: null },
    postView: { visible: false, id: null, title: '' }
  }

  editMethod: 'tab' | 'popup' = 'popup';
  viewMethod: 'tab' | 'popup' = 'popup';

  tabIndex: number = 0;
  tabs: TabInfo[] = [];
  tabTitle: any;

  /**
   * 게시판 트리 조회 Filter 조건
   */
  queryValue: any;

  private message = inject(NzMessageService);
  public viewContainerRef = inject(ViewContainerRef);
  private winRef = inject(WindowRef);
  private router = inject(Router);

  constructor() {

    const origin = window.location.origin;

    window.addEventListener('message', (event) => {

      // 다른 origin에서 호출할 경우 무시함
      if (event.origin !== origin) return;

      // BoardId가 저장한 게시글의 boardId가 일치하면 재조회
      if (btoa(this.drawer.board.formDataId) === event.data) {
        this.getArticleGridData();
      }

    }, false);
  }

  ngAfterViewInit(): void {
    this.getBoardTree();
  }

  setBoardSelect(item: any): void {
    this.tabTitle = item.title;
    this.drawer.board.formDataId = item.key;

    this.getArticleGridData();
  }

  getArticleGridData(): void {
    this.drawer.postForm.visible = false;
    this.drawer.postView.visible = false;

    //this.articleGrid().getArticleList(this.drawer.board.initLoadId);
    this.postList().getList(this.drawer.board.formDataId);
  }

  getBoardTree(): void {
    this.drawer.board.visible = false;
    this.boardTree().getboardHierarchy();
  }

  newPost(): void {
    if (this.drawer.board.formDataId === null || this.drawer.board.formDataId === undefined)  {
      this.message.create('error', '게시판을 선택해주세요.');
      return;
    }

    //if (this.drawer.postForm.use) {
    if (this.editMethod == 'tab') {
      this.newPostTab();
    } else {
      this.newPostPopup();
    }

  }

  // 게시글 등록 폼 팝업으로 오픈
  newPostPopup() {
    const boardId = btoa(this.drawer.board.formDataId);

    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/post-write`, boardId])  // /grw/boarda
    );
    const popOption = 'scrollbars=yes, menubar=no, resizable=no, top=0, left=0, width=800, height=800';
    var windowObjectReference = this.winRef.nativeWindow.open(url, '_blank', popOption);
    windowObjectReference.focus();
  }

  newPostTab() {
    this.drawer.postForm.boardId = btoa(this.drawer.board.formDataId);
    this.drawer.postForm.formDataId = null;
    this.drawer.postForm.visible = true;
  }

  editPost(item: any) {
    console.log(item);

    if (this.editMethod == 'tab') {
      this.editPostTab(item.boardId, item.postId);
    } else {
      this.editPostPopup(item);
    }
  }

  editPostPopup(post: PostListData) {
    const boardId = btoa(this.drawer.board.formDataId);
    const postId = btoa(post.postId);

    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/post-edit`, boardId, postId])  // /grw/boarda
    );
    const popOption = 'scrollbars=yes, menubar=no, resizable=no, top=0, left=0, width=800, height=800';
    var windowObjectReference = this.winRef.nativeWindow.open(url, '_blank', popOption);
    windowObjectReference.focus();
  }

  editPostTab(boardId: string, postId: string) {
    this.drawer.postForm.boardId = btoa(boardId);
    this.drawer.postForm.formDataId = btoa(postId);

    if (this.drawer.postForm.formDataId === null || this.drawer.postForm.formDataId === undefined) {
      this.message.create('error', '게시글을 선택해주세요.');
      return;
    }

    this.drawer.postForm.visible = true;
  }

  viewPost(article: PostListData) {
    this.drawer.postView.id = article.postId;
    this.drawer.postView.title = article.title;

    if (this.viewMethod == 'tab') {
      this.viewPostTab();
    } else {
      this.viewPostPopup(article.postId);
    }
  }

  viewPostPopup(postId: string) {
    const postIdParam = btoa(postId);

    const url = this.router.serializeUrl(
      //this.router.createUrlTree([`/article-view`, {article: JSON.stringify(article)}])  // /grw/boarda
      this.router.createUrlTree([`/post-view`, {postId: postIdParam}])  // /grw/boarda
    );
    const popOption = 'scrollbars=yes, menubar=no, resizable=no, top=0, left=0, width=800, height=800';
    var windowObjectReference = this.winRef.nativeWindow.open(url, '_blank', popOption);
    windowObjectReference.focus();
  }

  viewPostTab(): void {
    let title: string | null = '';
    const title_lentgh = this.drawer.postView.title.length as number;
    if (title_lentgh > 8) {
      title = this.drawer.postView.title.substring(0, 8) + '...';
    } else {
      title = this.drawer.postView.title as string;
    }

    const postId = btoa(this.drawer.postView.id);
    const newTab: TabInfo = {
      tabName: title,
      postId: postId
    }

    let tabIndex = null;
    for (const index in this.tabs) {
      if (this.tabs[index].postId === this.drawer.postView.id) {
        tabIndex = index;
      }
    }

    if (tabIndex === null) {
      this.tabs.push(newTab);
      this.tabIndex = this.tabs.length;
    } else {
      this.tabIndex = parseInt(tabIndex,10) + 1;
    }

  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index-1, 1);
  }

}
