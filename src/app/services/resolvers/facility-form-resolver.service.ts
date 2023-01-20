import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError, of } from 'rxjs';
import { FacilitiesService } from "@services/facilities/facilities.service";

@Injectable({
  providedIn: 'root'
})
export class FacilityFormResolverService implements Resolve<any> {

  constructor(private facilityService: FacilitiesService, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const id = parseInt(route.paramMap.get('id')!);
      return this.facilityService.getFacility(id).pipe(catchError(()=>{
        this.location.back();
        return of();
      }));
  }
}
