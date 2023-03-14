import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SystemServiceEnum } from '@enums/system-service.enum';
import { Model } from '@models/model.model';
import { SystemService } from '@models/system-service.model';
import { ModelsService } from '@services/model-cars/models.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-models-form',
  templateUrl: './models-form.component.html',
})
export class ModelsFormComponent implements OnInit {
  id!: number;
  model: Model | null = null;

  modelForm = this.fb.group({
    id:[null],
    code: [ '', [Validators.required, this.validatorService.isAlphanumeric(), Validators.pattern("!/^\s/") ] ],
    year:[null, [ Validators.required, Validators.min(1000), Validators.max(9999)]],
    name:['', [Validators.required, this.validatorService.isAlphabetic2()]],
    description: ['',this.validatorService.isAlphanumeric(),  Validators.pattern("!/^\s/") ],
    accountNumber:[null,[ this.validatorService.isAlphanumeric() ]],
    systemServices: [[], [Validators.required]],
    status:[1]
  },{ asyncValidators:[ this.validatorService.modelUnique() ]});

  get isFinantialSelected(){
    return (this.modelForm.get("systemServices")?.value as SystemService[]).find(systemService => systemService.name === SystemServiceEnum.IF);
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modelService: ModelsService,
    private location: Location,
    private messageService: MessageService,
    private validatorService: ValidatorService,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
    const modelEdit: Model = this.route.snapshot.data["data"]["model"];
    if (modelEdit) {
      this.model = modelEdit;
      this.id = modelEdit.id!;
      const containsIf = modelEdit.systemServices.find((systemService: SystemService) => systemService.name === SystemServiceEnum.IF);
      if(containsIf){
        this.modelForm?.get("accountNumber")?.clearValidators();
        this.modelForm?.get("accountNumber")?.setValidators([Validators.required, this.validatorService.isAlphanumeric()]);
        this.modelForm?.get("accountNumber")?.updateValueAndValidity();
      }
      this.modelForm.clearAsyncValidators();
      this.modelForm.setAsyncValidators(this.validatorService.modelUnique({ code: modelEdit.code, year: modelEdit.year }));
      this.modelForm.updateValueAndValidity();
      this.modelForm.reset(modelEdit);
      this.modelForm?.get("accountNumber")?.reset(modelEdit.account?.accountNumber);
      this.modelForm.markAllAsTouched();
    }
    this.validationService.form = this.modelForm;
  }

  submit() {
    const model = this.modelForm.value;
    if(this.model && model.accountNumber){
      if(this.model.account){
        model.account = {...this.model.account, accountNumber: model.accountNumber};
      }else{
        model.account = {accountNumber: model.accountNumber};
      }
    }else if(model.accountNumber){
      model.account = {accountNumber: model.accountNumber};
    }
    if(!this.isFinantialSelected && model.account){
      model.account = null;
    }
    if (!this.id) {
      this.modelService
        .addModel(model)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Model saved successfully',
            detail: 'Success',
          });
          this.location.back();
        });
    } else {
      this.modelService
        .editModel(model, this.id)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Model updated successfully',
            detail: 'Success',
          });
          this.location.back();
        });
    }
  }
}
