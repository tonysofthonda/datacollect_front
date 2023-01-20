export interface MenuCategory {
  id: number;
  name: string;
  zOrder: number;
  views: View[];
}

export interface View {
  id: number;
  name: string;
  friendlyName: string;
  route: string;
  zOrder: number;
}
