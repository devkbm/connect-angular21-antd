import { Injectable } from '@angular/core';

export interface MenuBreadCrumb {
  name: string;
  isLink: boolean;
  url?: string;
  marked?: boolean
}

export interface MenuGroup {
  menuGroupCode: string | null;
  menuGroupName: string | null;
  menuGroupUrl: string | null;
  description: string | null;
  sequence: number | null;
}

export interface Role {
  roleCode: string | null;
  roleName: string | null;
  description: string | null;
  menuGroupCode: string | null;
}

export interface UserToken {
  sessionId: string;
  userId: string;
  userName: string;
  companyCode: string;
  staffNo: string;
  email: string;
  imageUrl: string;
  ipAddress: string;
  roleList: Role[];
  menuGroupList: MenuGroup[];
}

@Injectable({
  providedIn: 'root'
})
export class SessionManager {

  constructor() { }

  static saveSessionStorage(data: UserToken) {
    sessionStorage.setItem('token', data.sessionId);
    sessionStorage.setItem('userId', data.userId);
    sessionStorage.setItem('userName', data.userName);
    sessionStorage.setItem('companyCode', data.companyCode);
    sessionStorage.setItem('staffNo', data.staffNo);
    sessionStorage.setItem('email', data.email);
    sessionStorage.setItem('imageUrl', data.imageUrl);
    sessionStorage.setItem('ipAddress', data.ipAddress);
    sessionStorage.setItem('menuGroupList', JSON.stringify(data.menuGroupList));
    sessionStorage.setItem('roleList', JSON.stringify(data.roleList));
  }

  static getcompanyCode(): string | null {
    return sessionStorage.getItem('companyCode');
  }

  static getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  static getStaffNo(): string | null {
    return sessionStorage.getItem('staffNo');
  }

  static getMenuList(): any {
    return JSON.parse(sessionStorage.getItem('menuList') as string);
  }

  /**
   * Menu BreadCrumb 데이터 생성
   * @returns
   */
  static createBreadCrumb(): MenuBreadCrumb[] {
    /*
    let convertMenuBread = (obj: any, level: number): MenuBread => {
      return {
        name: obj.title as string,
        isLink: obj.menuType === 'ITEM' ? true : false,
        url: obj.url as string,
      };
    }

    let convertMenuChildren = (children: any[], level: number): MenuBread[] => {
      let item: MenuBread[] = new Array();
      for (const child of children) {
        item.push(convertMenuBread(child, level));
      }
      return item;
    }
    */

    const menuGroupList = JSON.parse(sessionStorage.getItem('menuGroupList') as string);
    const sessionMenuGroup    = sessionStorage.getItem('selectedMenuGroup') as string;
    let menuGroupUrl = '';
    for (const menuGroup of menuGroupList) {
      if (menuGroup.menuGroupCode === sessionMenuGroup) {
        menuGroupUrl = menuGroup.menuGroupUrl;
      }
    }

    const obj = JSON.parse(sessionStorage.getItem('menuList') as string);
    let names: MenuBreadCrumb[] = new Array();
    // 현재 화면에 해당하는 메뉴 탐색
    let find = (children: any[]): boolean => {
      for (const child of children) {
        names.push({name: child.title, isLink: child.menuType === 'ITEM' ? true : false, url: child.url, marked: false});
        if (child.leaf) {
          if (window.location.pathname === '/' + menuGroupUrl + '/' + child.url) {
            names[names.length-1].marked = true;
            return true;
          } else {
            names.pop();  // Leaf 노드중 일치하지 않은 메뉴 제거
          }
        } else if (child.children) {
          find(child.children);
          if (names[names.length-1].marked !== true) { // Leaf 노드 중 marked 되지 않은 노드 제거
            names.pop();
          }
        }
      }
      return false;
    }
    find(obj);

    //console.log(names);
    return names;
  }

}
