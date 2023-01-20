import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ModelsService } from '@services/model-cars/models.service';
import { SystemServiceService } from '@services/system-service/system-service.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelsFormResolverService implements Resolve<any>{

  constructor(private modelService: ModelsService, private systemServiceService: SystemServiceService, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const id = parseInt(route.paramMap.get("id")!);
      const error = ()=>{
        this.location.back();
        return of();
      }
      return forkJoin({
        model: id ? this.modelService.getModel(id).pipe(catchError(error)) : of(null),
        systemServices: this.systemServiceService.getSystemServices().pipe(catchError(error))
      }).pipe(catchError(error));
  }
}
