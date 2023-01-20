import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealerGroupFormResolverService } from '@services/resolvers/dealer-group-form-resolver.service';
import { DealerGroupFormComponent } from './pages/dealer-group-form/dealer-group-form.component';
import { DealerGroupsListComponent } from './pages/dealer-groups-list/dealer-groups-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: DealerGroupsListComponent },
      { path: 'add', component: DealerGroupFormComponent },
      { path: 'edit/:id', component: DealerGroupFormComponent, resolve:{ dealerGroup: DealerGroupFormResolverService }},
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealerGroupsRoutingModule {}
