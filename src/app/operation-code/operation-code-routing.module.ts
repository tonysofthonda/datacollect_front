import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationCodeFormResolverService } from '@services/resolvers/operation-code-form-resolver.service';
import { OperationCodeUpdateComponent } from './pages/operation-code-update/operation-code-update.component';
import { OperationCodeComponent } from './pages/operation-code.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'operation-code', component: OperationCodeComponent },
      { path: 'add', component: OperationCodeUpdateComponent, resolve: { data: OperationCodeFormResolverService } },
      { path: 'edit/:id', component: OperationCodeUpdateComponent, resolve: { data: OperationCodeFormResolverService } },
      { path: '**', redirectTo: 'operation-code' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationCodeRoutingModule {}
