import { Dealer } from './dealer.model';
import { Facility } from './facility.model';

export interface DealerFacility {
  dealer: Dealer;
  facility: Facility;
  quantity: number;
}

export interface DealerFacilityTable extends DealerFacility{
  concept: string;
}


export const castToDealerFacilityTable = (dealerFacility: DealerFacility): DealerFacilityTable => ({
  ...dealerFacility,
  concept: dealerFacility.facility.concept
});
