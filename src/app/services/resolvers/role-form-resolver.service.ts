import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { LdapGroupsService } from '@services/ldap-groups/ldap-groups.service';
import { PositionService } from '@services/position-service/position.service';
import { RolesService } from '@services/roles/roles.service';
import { ViewsService } from '@services/views/views.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleFormResolverService implements Resolve<any>{

  constructor(
    private roleService: RolesService,
    private ldapGroupService: LdapGroupsService,
    private positionService: PositionService,
    private viewService: ViewsService,
    private location: Location
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = parseInt(route.paramMap.get("id")!);
    const error = () => {
      this.location.back();
      return of();
    };
    return forkJoin(
      {
        role: id ? this.roleService.getRole(id) : of(null),
        ldapGroups: this.ldapGroupService.getLdapGroups(),
        positions: this.positionService.getPositions(),
        views: this.viewService.getViews()
      }
    ).pipe(catchError(error));
  }
}
