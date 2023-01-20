import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FetchType } from '@enums/fetch-type.enum';
import { DealerGroupsService } from '@services/dealer-groups/dealer-groups.service';
import { FinancialStateStatusService } from '@services/financial-state-status/financial-state-status.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialStatesResolverService implements Resolve<any> {

  constructor(
    private dealerGroupService: DealerGroupsService,
    private financialStateStatusService: FinancialStateStatusService,
    private location: Location
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const error = ()=>{
      this.location.back();
      return of();
    }

    return forkJoin({
      dealerGroups: this.dealerGroupService.getDealerGroups(0, 0, FetchType.EAGER),
      statuses: this.financialStateStatusService.getFinancialStateStatuses()
    }).pipe(catchError(error))
  }
}
