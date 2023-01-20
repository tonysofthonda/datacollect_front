import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OperationCodeRoutingModule } from './operation-code-routing.module';
import { OperationCodeComponent } from './pages/operation-code.component';
import { OperationCodeUpdateComponent } from './pages/operation-code-update/operation-code-update.component';

@NgModule({
  declarations: [
      OperationCodeComponent,
      OperationCodeUpdateComponent
  ],
  imports: [
    CommonModule,
    OperationCodeRoutingModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class OperationCodeModule {}
