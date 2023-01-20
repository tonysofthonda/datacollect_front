import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacilityFormResolverService } from '@services/resolvers/facility-form-resolver.service';
import { FacilitiesListComponent } from './pages/facilities-list/facilities-list.component';
import { FacilityFormComponent } from './pages/facility-form/facility-form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: FacilitiesListComponent },
      { path: 'add', component: FacilityFormComponent },
      { path: 'edit/:id', component: FacilityFormComponent, resolve: {facility: FacilityFormResolverService} },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilitiesRoutingModule {}
