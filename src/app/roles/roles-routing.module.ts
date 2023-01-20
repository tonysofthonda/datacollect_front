import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleFormResolverService } from '@services/resolvers/role-form-resolver.service';
import { RolesFormComponent } from './pages/roles-form/roles-form.component';
import { RolesListComponent } from './pages/roles-list/roles-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: RolesListComponent },
      { path: 'add', component: RolesFormComponent, resolve: { data: RoleFormResolverService } },
      { path: 'edit/:id', component: RolesFormComponent, resolve: { data: RoleFormResolverService } },
      { path: '**', redirectTo: 'list' }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
