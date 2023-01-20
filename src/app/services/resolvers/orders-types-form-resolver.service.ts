import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { OrdersTypesService } from '@services/orders-types/orders-types.service';
import { ServicesTypesService } from '@services/services-types/services-types.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersTypesFormResolverService implements Resolve<any> {

  constructor(private orderTypeService: OrdersTypesService, private servicesTypesService: ServicesTypesService, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const id = parseInt(route.paramMap.get("id")!);
      const error = () => {
        this.location.back();
        return of();
      };
      return forkJoin(
        {
          orderType: id ? this.orderTypeService.getOrderType(id) : of(null),
          serviceTypes: this.servicesTypesService.getServicesTypes()
        }
      ).pipe(catchError(error));
  }
}
