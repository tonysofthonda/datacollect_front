import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialDetailComponent } from './components/financial-details/financial-details.component';
import { FinancialStateListComponent } from './pages/financial-state-list/financial-state-list.component';

const routes: Routes = [{path: '', children:[
  //{ path: 'list', component: FinancialStateListComponent,  resolve: { data: FinancialStatesResolverService }},
  { path: 'list', component: FinancialStateListComponent },
  { path: 'details/:id', component: FinancialDetailComponent},
  { path: '**', redirectTo: 'list' },
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialStateRoutingModule { }
