import { ServiceType } from "./service-type.model";

export interface OrderType {
  id?: number;
  code: string;
  description: string;
  servicesTypes: ServiceType[];
}


