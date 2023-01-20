import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelsFormResolverService } from '@services/resolvers/models-form-resolver.service';
import { ModelsFormComponent } from './pages/models-form/models-form.component';
import { ModelsListComponent } from './pages/models-list/models-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: ModelsListComponent },
      { path: 'add', component: ModelsFormComponent, resolve: { data: ModelsFormResolverService } },
      { path: 'edit/:id', component: ModelsFormComponent, resolve: { data: ModelsFormResolverService } },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelRoutingModule {}
