import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SystemServiceEnum } from '@enums/system-service.enum';
import { SystemService } from '@models/system-service.model';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';

@Component({
  selector: 'app-system-services',
  templateUrl: './system-services.component.html',
})
export class SystemServicesComponent implements OnInit {
  @Input() modelFormControl!: AbstractControl | null;

  systemServiceControl = this.fb.control('', Validators.required);

  systemServices: SystemService[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public validatorsService: ValidatorService,
    public validationService: ValidationService) { }

  ngOnInit(): void {
    this.systemServices = this.route.snapshot.data["data"]["systemServices"];
  }

  addSystemService() {
    const systemServiceSelected = this.systemServiceControl.value as SystemService;
    const systemServicesSelected = this.modelFormControl?.get("systemServices")?.value as SystemService[];

    const alreadySelected = systemServicesSelected.find(
      (systemService) => systemService.id === systemServiceSelected.id
    );
    if (!alreadySelected) {
      if(systemServiceSelected.name === SystemServiceEnum.IF){
        this.modelFormControl?.get("accountNumber")?.clearValidators();
        this.modelFormControl?.get("accountNumber")?.setValidators([Validators.required, this.validatorsService.isAlphanumeric()]);
        this.modelFormControl?.get("accountNumber")?.updateValueAndValidity();
      }
      this.modelFormControl?.get("systemServices")?.reset([
        ...systemServicesSelected,
        systemServiceSelected,
      ]);
    }
  }

  removeSystemService(id: number) {
    const systemServicesSelected = this.modelFormControl?.get("systemServices")?.value as SystemService[];
    const systemService =  systemServicesSelected.find((systemService)=>systemService.id === id);
    const newValue = systemServicesSelected.filter((systenServiceFilter) => systenServiceFilter.id !== id);

    if(systemService?.name === SystemServiceEnum.IF){
      this.modelFormControl?.get("accountNumber")?.clearValidators();
      this.modelFormControl?.get("accountNumber")?.updateValueAndValidity();
    }


    this.modelFormControl?.get("systemServices")?.reset(newValue);
  }

}
