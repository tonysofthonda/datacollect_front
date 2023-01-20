import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnsavedChangesGuard } from '@guards/unsaved-changes/unsaved-changes.guard';
import { FinancialStateFormResolverService } from '@services/resolvers/financial-state-form-resolver.service';
import { FinancialStatesResolverService } from '@services/resolvers/financial-states-resolver.service';
import { FinancialStateFormComponent } from './pages/financial-state-form/financial-state-form.component';
import { FinancialStateListComponent } from './pages/financial-state-list/financial-state-list.component';

const routes: Routes = [{path: '', children:[
  { path: 'list', component: FinancialStateListComponent,  resolve: { data: FinancialStatesResolverService }},
  { path: 'form/:id', component: FinancialStateFormComponent, resolve: { data: FinancialStateFormResolverService }, canDeactivate: [UnsavedChangesGuard]},
  { path: '**', redirectTo: 'list' },
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialStateRoutingModule { }
