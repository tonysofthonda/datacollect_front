import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DealerGroupsService } from '@services/dealer-groups/dealer-groups.service';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealerGroupFormResolverService implements Resolve<any>{

  constructor(private dealerGroupService: DealerGroupsService, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = parseInt(route.paramMap.get('id')!);
    return this.dealerGroupService.getDealerGroup(id).pipe(catchError(()=>{
      this.location.back();
      return of();
    }));
  }
}
