import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelRoutingModule } from './model-routing.module';
import { ModelsListComponent } from './pages/models-list/models-list.component';
import { PrimeNgModule } from '../prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelsFormComponent } from './pages/models-form/models-form.component';
import { SystemServicesComponent } from './components/system-services/system-services.component';

@NgModule({
  declarations: [ModelsListComponent, ModelsFormComponent, SystemServicesComponent],
  imports: [
    CommonModule,
    ModelRoutingModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ModelModule {}
