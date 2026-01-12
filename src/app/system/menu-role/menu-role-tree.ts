import { CommonModule } from '@angular/common';
import { Component, inject, viewChild, input, output, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzTreeComponent, NzTreeModule, NzTreeNode } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

import { ResponseList } from 'src/app/core/model/response-list';

import { NzTreeNodeKey } from 'ng-zorro-antd/core/tree';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';


export interface MenuRoleHierarchy {
  title: string;
  key: string;
  checked: boolean;
  expanded: boolean;
  selected: boolean;
  isLeaf: boolean;
  children: MenuRoleHierarchy[];

  halfChecked: boolean;
  menuGroupCode: string;
  menuCode: string;
  roleCode: string;
}

export interface MenuRoleMapping {
  menuGroupCode: string;
  menuCode: string;
  roleCode: string;
}

function convert(tree: MenuRoleHierarchy[]) {
  return tree.reduce(function(acc: string[], o) {
    if (o.checked)
      acc.push(o.key);
    if (o.children)
      acc = acc.concat(convert(o.children));
    return acc;
  }, []);
}

@Component({
  selector: 'app-menu-role-tree',
  imports: [
    CommonModule,
    FormsModule,
    NzTreeModule,
    NzButtonComponent
  ],
  template: `
    <!--{{defaultCheckedKeys | json}}-->
    <!--{{saveNodes | json}}-->
    <!--{{menuGroupCode()}} - {{roleCode()}}-->
    <!--<button nz-button (click)="getHierarchy()">조회</button>-->
    메뉴-롤 설정
    <nz-tree
        class="body"
        #treeComponent
        nzCheckable
        [nzData]="nodeItems()"
        [nzSearchValue]="searchValue()"
        [nzCheckedKeys]="defaultCheckedKeys"
        (nzCheckBoxChange)="nzCheck()"
        (nzClick)="nzClick($event)">
    </nz-tree>

    <div class="footer">
      <button nz-button (click)="save()">저장</button>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .body {
      flex: 1;
    }

    .footer {
      text-align: right;
    }
  `
})
export class MenuRoleTree {

  treeComponent = viewChild.required(NzTreeComponent);

  //nodeItems: MenuRoleHierarchy[] = [];
  nodeItems = signal<MenuRoleHierarchy[]>([]);
  defaultCheckedKeys: NzTreeNodeKey[] = [];

  saveNodes: MenuRoleMapping[] = [];
  saveNodeKeys = new Set<string>();

  menuGroupCode = input.required<string>();
  roleCode = input.required<string>();

  searchValue = input<string>('');

  itemSelected = output<any>();

  private http = inject(HttpClient);

  constructor() {
    effect(() => {
      if (this.menuGroupCode() && this.roleCode()) {
        this.getHierarchy();
      } else {
        this.nodeItems.set([]);
      }
    });
  }

  public getHierarchy(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/menurolehierarchy/${this.menuGroupCode()}/${this.roleCode()}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<MenuRoleHierarchy>>(url, options).pipe(
                //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseList<MenuRoleHierarchy>) => {
            if ( model.data ) {
              this.nodeItems.set(model.data);

              //this.defaultCheckedKeys = this.nodeItems.flatMap(e => [e, ...e.children || []]).map(e => e.checked ? e.key : -1).filter(val => val !== -1);
              this.defaultCheckedKeys = convert(this.nodeItems());
              console.log(this.defaultCheckedKeys);
              console.log(convert(this.nodeItems()));

            } else {
              this.nodeItems.set([]);
            }
          }
      )

  }

  nzClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

  nzCheck(): void {
    //console.log(this.treeComponent().getCheckedNodeList());
    //console.log(this.treeComponent().getHalfCheckedNodeList());
    //console.log(event);

    this.setSaveNodes();
  }

  save() {
    this.setSaveNodes();

    const url = GlobalProperty.serverUrl() + `/api/system/menurole`;
    const options = getHttpOptions();

    this.http
        .post<ResponseList<MenuRoleMapping>>(url, this.saveNodes, options).pipe(
          //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseList<MenuRoleMapping>) => {
            this.getHierarchy();
          }
        )
  }

  setSaveNodes() {
    this.saveNodeKeys.clear();
    this.saveNodes = [];

    const nodes: NzTreeNode[] = this.treeComponent().getCheckedNodeList();
    console.log("checked");
    console.log(nodes);
    for (var node of nodes) {
      const menu_role = node.origin as MenuRoleHierarchy;
      this.saveNodeKeys.add(menu_role.menuGroupCode + menu_role.menuCode + this.roleCode());
      this.saveNodes.push({
        menuGroupCode: menu_role.menuGroupCode,
        menuCode: menu_role.menuCode,
        roleCode: this.roleCode()
      });

      var addChildren = (nodes: NzTreeNode[]) => {
          for (var childNode of nodes) {
            const child_menu_role = childNode.origin as MenuRoleHierarchy;
            if (!this.saveNodeKeys.has(child_menu_role.menuGroupCode+ child_menu_role.menuCode + this.roleCode())) {
              this.saveNodeKeys.add(child_menu_role.menuGroupCode + child_menu_role.menuCode + this.roleCode());
              this.saveNodes.push({
                menuGroupCode: child_menu_role.menuGroupCode,
                menuCode: child_menu_role.menuCode,
                roleCode: this.roleCode()
              });
            }

            if (childNode.children) {
              addChildren(childNode.children);
            }
        }
      };

      if (node.children !== null) {
        addChildren(node.children);
      }

      /*
      if (node.children !== null) {
        for (var childNode of node.children) {
          const child_menu_role = childNode.origin as MenuRoleHierarchy;
          if (!this.saveNodeKeys.has(child_menu_role.menuGroupCode+ child_menu_role.menuCode + child_menu_role.roleCode)) {
            this.saveNodeKeys.add(child_menu_role.menuGroupCode + child_menu_role.menuCode + child_menu_role.roleCode);
            this.saveNodes.push({
              menuGroupCode: child_menu_role.menuGroupCode,
              menuCode: child_menu_role.menuCode,
              roleCode: child_menu_role.roleCode
            });
          }
        }
      }
      */
      //console.log(menu_role.children);
    }

    // 하위 노드 중 일부만 선택(HalfChecked)되어있을 경우 상위 노드도 포함
    const halfCheckedNodes: NzTreeNode[] = this.treeComponent().getHalfCheckedNodeList();
    console.log("halfCheckedNodes");
    console.log(halfCheckedNodes);
    for (var node of halfCheckedNodes) {
      const menu_role = node.origin as MenuRoleHierarchy;
      if (!this.saveNodeKeys.has(menu_role.menuGroupCode+ menu_role.menuCode + this.roleCode())) {
        this.saveNodeKeys.add(menu_role.menuGroupCode + menu_role.menuCode + this.roleCode());
        this.saveNodes.push({
          menuGroupCode: menu_role.menuGroupCode,
          menuCode: menu_role.menuCode,
          roleCode: this.roleCode()
        });
      }
    }
  }

}
