import { Status } from '@enums/status.enum';
import { City } from './city.model';
import { DealerGroup } from './dealer-group.model';
import { Terchief } from './terchief.model';
import { Workshop } from './workshop.model';

export interface Dealer {
  id?: number;
  dealerNumber: string;
  name: string;
  businessName?: string;
  rfc?: string;
  city: City;
  street?: string;
  neighborhood?: string;
  postcode?: number;
  dealerGroup: DealerGroup;
  terchief: Terchief;
  workshop: Workshop;
  status: Status;
}

export interface DealerTable {
  id?: number;
  dealerNumber: string;
  name: string;
  businessName?: string;
  rfc?: string;
  city: City;
  street?: string;
  neighborhood?: string;
  postcode?: number;
  dealerGroup: string;
  terchief: string;
  workshop: Workshop;
  status: Status;
}

export const castToDealerTable = (dealer: Dealer): DealerTable => ({
  ...dealer,
  dealerGroup: dealer.dealerGroup.name,
  terchief: `${dealer.terchief.firstName} ${dealer.terchief.lastName} ${dealer.terchief.motherLastName ? dealer.terchief.motherLastName : ''}`,
});
