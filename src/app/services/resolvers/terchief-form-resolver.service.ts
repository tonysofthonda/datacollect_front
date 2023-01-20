import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TerchiefsService } from '@services/terchiefs/terchiefs.service';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerchiefFormResolverService implements Resolve<any>{

  constructor(private terchiefService: TerchiefsService,private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = parseInt(route.paramMap.get('id')!);
    return this.terchiefService.getTerchief(id).pipe(catchError(()=>{
      this.location.back();
      return of();
    }));
  }
}
