import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { OperationCodeService } from '@services/operation-code/operation-code.service';
import { ServicesTypesService } from '@services/services-types/services-types.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationCodeFormResolverService implements Resolve<any>{

  constructor(private operationCodeService: OperationCodeService,private serviceTypeService: ServicesTypesService, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const id = parseInt(route.paramMap.get("id")!);
      return forkJoin({
        operationCode: id ? this.operationCodeService.findOperationCodeRecord(id) : of(null),
        serviceTypes: this.serviceTypeService.getServicesTypes()
      }).pipe(catchError(()=>{
        this.location.back();
        return of();
      }))
  }
}
