import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealersFormResolverService } from '@services/resolvers/dealers-form-resolver.service';
import { DealersFormComponent } from './pages/dealers-form/dealers-form.component';
import { DealersListComponent } from './pages/dealers-list/dealers-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: DealersListComponent },
      { path: 'add', component: DealersFormComponent, resolve: { data: DealersFormResolverService } },
      { path: 'edit/:id', component: DealersFormComponent, resolve: { data: DealersFormResolverService } },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealersRoutingModule {}
