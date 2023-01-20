import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../prime-ng.module';
import { RolesFormComponent } from './pages/roles-form/roles-form.component';
import { GeneralFormComponent } from './components/general-form/general-form.component';
import { SystemRolesFormComponent } from './components/system-roles-form/system-roles-form.component';
import { PermissionsFormComponent } from './components/permissions-form/permissions-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LdapListComponent } from './components/ldap/ldap-list/ldap-list.component';
import { LdapFormComponent } from './components/ldap/ldap-form/ldap-form.component';
import { LdapContainerComponent } from './components/ldap/ldap-container/ldap-container.component';
import { DealerRolesContainerComponent } from './components/dealer-roles/dealer-roles-container/dealer-roles-container.component';
import { DealerRolesListComponent } from './components/dealer-roles/dealer-roles-list/dealer-roles-list.component';
import { DealerRolesFormComponent } from './components/dealer-roles/dealer-roles-form/dealer-roles-form.component';

@NgModule({
  declarations: [
    RolesListComponent,
    RolesFormComponent,
    GeneralFormComponent,
    SystemRolesFormComponent,
    PermissionsFormComponent,
    LdapListComponent,
    LdapFormComponent,
    LdapContainerComponent,
    DealerRolesContainerComponent,
    DealerRolesListComponent,
    DealerRolesFormComponent,
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule,
    PrimeNgModule,
    ReactiveFormsModule
  ]
})
export class RolesModule { }
