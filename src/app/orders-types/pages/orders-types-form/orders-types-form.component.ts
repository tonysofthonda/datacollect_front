import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderType } from '@models/order-type.model';
import { OrdersTypesService } from '@services/orders-types/orders-types.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-orders-types-form',
  templateUrl: './orders-types-form.component.html',
})
export class OrdersTypesFormComponent implements OnInit {
  id!: number;
  submited: boolean = false;
  orderTypeForm = this.fb.group({
    id:[null],
    code: ['', [ Validators.required, Validators.maxLength(5), this.validatorService.isAlphanumeric() ],
      [this.validatorService.orderTypeCodeUnique()],
    ],
    description: ['', Validators.pattern("!/^\s/")] ,
    servicesTypes: [[], [Validators.required]],
  });

  constructor(
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private ordersTypesService: OrdersTypesService,
    private location: Location,
    private messageService: MessageService,
    private validatorService: ValidatorService,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
    const orderTypeEdit: OrderType = this.route.snapshot.data["data"]["orderType"];
    if (orderTypeEdit) {
      this.id = orderTypeEdit.id!;
      this.orderTypeForm.get("code")?.clearAsyncValidators();
      this.orderTypeForm.get("code")?.setAsyncValidators(this.validatorService.orderTypeCodeUnique(orderTypeEdit.code));
      this.orderTypeForm.get("code")?.updateValueAndValidity();
      this.orderTypeForm.reset(orderTypeEdit);
      this.orderTypeForm.markAllAsTouched();
    }
    this.validationService.form = this.orderTypeForm;
  }

  submit() {
    this.submited = true;
    if (!this.id) {
      this.ordersTypesService
        .addOrderType(this.orderTypeForm.value)
        .pipe(catchError(()=>{
          this.submited = false;
          return of();
        }))
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Order Type saved successfully',
            detail: 'Success',
          });
          this.location.back();
        });
    } else {
      this.ordersTypesService
        .editOrderType(this.orderTypeForm.value, this.id)
        .pipe(catchError(()=>{
          this.submited = false;
          return of();
        }))
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Order Type updated successfully',
            detail: 'Success',
          });
          this.location.back();
        });
    }
  }
}
