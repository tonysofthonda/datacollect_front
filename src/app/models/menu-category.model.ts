import { View } from "./view.model";

export interface MenuCategory{
  id?: number;
  name: string;
  order: number;
  views: View[]
}
