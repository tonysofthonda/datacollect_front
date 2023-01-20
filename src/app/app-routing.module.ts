import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SamlComponent } from './saml/saml.component';

const routes: Routes = [
  {
    path: 'terchief',
    loadChildren: () =>
      import('./terchiefs/terchiefs.module').then((m) => m.TerchiefsModule),
  },
  {
    path: 'dealer',
    loadChildren: () =>
      import('./dealers/dealers.module').then((m) => m.DealersModule),
  },
  {
    path: 'dealergroup',
    loadChildren: () =>
      import('./dealer-groups/dealer-groups.module').then(
        (m) => m.DealerGroupsModule
      ),
  },
  {
    path: 'facility',
    loadChildren: () =>
      import('./facilities/facilities.module').then((m) => m.FacilitiesModule),
  },
  {
    path: 'model',
    loadChildren: () =>
      import('./model-cars/model.module').then((m) => m.ModelModule),
  },
  {
    path: 'operationcodes',
    loadChildren: () =>
      import('./operation-code/operation-code.module').then(
        (m) => m.OperationCodeModule
      ),
  },
  {
    path: 'orderstype',
    loadChildren: () =>
      import('./orders-types/orders-types.module').then(
        (m) => m.OrdersTypesModule
      ),
  },
  {
    path: 'role',
    loadChildren: () =>
      import('./roles/roles.module').then(
        (m) => m.RolesModule
      ),
  },
  {
    path: 'financialstate',
    loadChildren: () =>
      import('./financial-state/financial-state.module').then(
        (m) => m.FinancialStateModule
      ),
  },
  {
    path: 'saml',
    component: SamlComponent
  },
  { path: '**', redirectTo: 'terchief' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
