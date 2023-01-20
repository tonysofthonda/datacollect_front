import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersTypesRoutingModule } from './orders-types-routing.module';
import { OrdersTypesListComponent } from './pages/orders-types-list/orders-types-list.component';
import { PrimeNgModule } from '../prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { OrdersTypesFormComponent } from './pages/orders-types-form/orders-types-form.component';

@NgModule({
  declarations: [OrdersTypesListComponent, OrdersTypesFormComponent],
  imports: [
    CommonModule,
    OrdersTypesRoutingModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class OrdersTypesModule {}
