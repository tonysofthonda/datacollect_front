import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersTypesFormResolverService } from '@services/resolvers/orders-types-form-resolver.service';
import { OrdersTypesFormComponent } from './pages/orders-types-form/orders-types-form.component';
import { OrdersTypesListComponent } from './pages/orders-types-list/orders-types-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: OrdersTypesListComponent },
      { path: 'add', component: OrdersTypesFormComponent, resolve: { data: OrdersTypesFormResolverService } },
      { path: 'edit/:id', component: OrdersTypesFormComponent, resolve: { data: OrdersTypesFormResolverService } },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersTypesRoutingModule {}
