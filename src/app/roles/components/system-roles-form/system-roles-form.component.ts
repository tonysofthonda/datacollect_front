import { Component, OnDestroy } from '@angular/core';
import { RolesService } from '@services/roles/roles.service';

@Component({
  selector: 'app-system-roles-form',
  templateUrl: './system-roles-form.component.html',
})
export class SystemRolesFormComponent implements OnDestroy {

  constructor(private roleService: RolesService) { }

  ngOnDestroy(): void {
      this.roleService.ldapGroupsFormSelected = [];
      this.roleService.positionsFormSelected = [];
  }

}
