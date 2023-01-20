import { Dealer } from "./dealer.model";
import { Contact } from "./contact.model";
import { Position } from "./position.model";
import { SystemService } from "./system-service.model";

export interface DealerContact{
  id: number,
  dealer: Dealer,
  contact: Contact,
  position: Position,
  notifications: SystemService[]
}

export interface DealerContactTable extends DealerContact{
  name: string,
  email: string,
  notificationsNames: string,
  positionName: string,
  phoneNumber: string
}



export const castToDealerContactTable = (dealerContact: DealerContact): DealerContactTable => ({
  ...dealerContact,
  name: `${dealerContact.contact.firstName} ${dealerContact.contact.lastName} ${dealerContact.contact.motherLastName}`,
  email: dealerContact.contact.email,
  notificationsNames: dealerContact.notifications.map(systemService=>systemService.name).join(', '),
  positionName: dealerContact.position.name,
  phoneNumber: dealerContact.contact.phoneNumber || ''
});
