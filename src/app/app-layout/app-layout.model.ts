export interface MenuGroup {
  menuGroupId: string | null;
  menuGroupCode: string | null;
  menuGroupName: string | null;
  description: string | null;
}

export interface Menu {
  menuGroupId: string | null;
  menuId: string | null;
  menuCode: string | null;
  menuName: string | null;
  menuType: string | null;
  parentMenuId: string | null;
  sequence: number | null;
  appUrl: string | null;
}

export interface MenuHierarchy {
  createdDt: Date;
  createdBy: string;
  modifiedDt: Date;
  modifiedBy: string;
  key: string;
  title: string;
  menuGroupId: string;
  menuId: string;
  menuName: string;
  parentMenuId: string;
  menuType: string;
  sequence: number;
  level: number;
  url: string;
  selected: boolean;
  expanded: boolean;
  children: MenuHierarchy[]
}
