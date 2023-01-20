import { City } from './city.model';

export interface State {
  id: number;
  name: string;
  cities: City[];
}

export interface StatePlain {
  id: number;
  name: string;
}
