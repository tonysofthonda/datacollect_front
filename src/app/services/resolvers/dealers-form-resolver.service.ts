import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FetchType } from '@enums/fetch-type.enum';
import { DealerContactsService } from '@services/dealer-contacts/dealer-contacts.service';
import { DealerGroupsService } from '@services/dealer-groups/dealer-groups.service';
import { DealersService } from '@services/dealers/dealers.service';
import { FacilitiesService } from '@services/facilities/facilities.service';
import { PositionService } from '@services/position-service/position.service';
import { StatesService } from '@services/states/states.service';
import { SystemServiceService } from '@services/system-service/system-service.service';
import { TerchiefsService } from '@services/terchiefs/terchiefs.service';
import { WorkshopsService } from '@services/workshops/workshops.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealersFormResolverService implements Resolve<any>{

  constructor(
    private dealerService: DealersService,
    private stateService: StatesService,
    private dealerGroupService: DealerGroupsService,
    private terchiefService: TerchiefsService,
    private workshopService: WorkshopsService,
    private facilityService: FacilitiesService,
    private positionService: PositionService,
    private systemServiceService: SystemServiceService,
    private location: Location
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const id = parseInt(route.paramMap.get("id")!);
      const error = ()=>{
        this.location.back();
        return of();
      }

      return forkJoin({
        dealer: id ? this.dealerService.getDealer(id) : of(null),
        states: this.stateService.getStates(),
        dealersGroups: this.dealerGroupService.getDealerGroups(0, 0, FetchType.EAGER),
        terchiefs: this.terchiefService.getTerchiefs(0, 0, FetchType.EAGER),
        workshops: this.workshopService.getWorkshops(),
        facilities: id ? this.facilityService.getFacilities(0, 0, FetchType.EAGER) : of(null),
        positions: id ? this.positionService.getPositions() : of(null),
        systemServices: id ? this.systemServiceService.getSystemServices() : of(null),
      }).pipe(catchError(error))
  }
}
