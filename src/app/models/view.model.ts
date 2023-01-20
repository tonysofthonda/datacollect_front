import { MenuCategory } from "./menu-category.model";
import { Role } from "./role.model";

export interface View{
  id?: number;
  name: string;
  friendlyName: string;
  route: string;
  order: number;
  menuCategory: MenuCategory;
  viewActions: ViewAction[];
}

export interface ViewAction{
  id?: number;
  shortName: string;
  friendlyName: string;
  view: View;
  assignedRoles: Role[]
}
