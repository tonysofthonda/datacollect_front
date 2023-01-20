import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerchiefFormResolverService } from '@services/resolvers/terchief-form-resolver.service';
import { TerchiefFormComponent } from './pages/terchief-form/terchief-form.component';
import { TerchiefsListComponent } from './pages/terchiefs-list/terchiefs-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: TerchiefsListComponent },
      { path: 'add', component: TerchiefFormComponent },
      { path: 'edit/:id', component: TerchiefFormComponent, resolve:{ terchief: TerchiefFormResolverService } },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerchiefsRoutingModule {}
