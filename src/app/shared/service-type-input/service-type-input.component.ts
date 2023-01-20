import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ServiceType } from '@models/service-type.model';
import { ValidationService } from '@services/validation/validation.service';

@Component({
  selector: 'app-service-type-input',
  templateUrl: './service-type-input.component.html',
})
export class ServiceTypeInputComponent implements OnInit {

  @Input() formInputControl!: AbstractControl | null;
  @Input() serviceTypes!: ServiceType[];

  serviceTypeControl = this.fb.control('', Validators.required);


  constructor(
    private fb: FormBuilder,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
  }

  addServiceType() {
    const serviceTypeSelected = this.serviceTypeControl.value as ServiceType;
    const servicesTypesSelected = this.formInputControl?.value as ServiceType[];
    const alreadySelected = servicesTypesSelected.find(
      (serviceType) => serviceType.id === serviceTypeSelected.id
    );
    if (!alreadySelected) {
      this.formInputControl?.reset([
        ...servicesTypesSelected,
        serviceTypeSelected,
      ]);
    }
  }

  removeServiceType(id: number) {
    const newValue = (
      this.formInputControl?.value as ServiceType[]
    ).filter((serviceType) => serviceType.id !== id);
    this.formInputControl?.reset(newValue);
  }
}
