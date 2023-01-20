import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DealerGroup } from '@models/dealer-group.model';
import { Dealer } from '@models/dealer.model';
import { Terchief } from '@models/terchief.model';
import { Workshop } from '@models/workshop.model';
import { DealersService } from '@services/dealers/dealers.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dealers-form',
  templateUrl: './dealers-form.component.html',
})
export class DealersFormComponent implements OnInit {
  id!: number;
  displayContacts: boolean = false;

  stateControl = this.fb.control(null, Validators.required);
  cityControl = this.fb.control(null, Validators.required);
  dealerGroupControl = this.fb.control(null, Validators.required);
  terchiefControl = this.fb.control(null, Validators.required);
  workshopControl = this.fb.control(null, Validators.required);

  dealerForm = this.fb.group({
    id:[null],
    dealerNumber: [ '', [ Validators.required, Validators.min(10000), Validators.max(999999)], [this.validatorService.dealerNumberUnique()] ],
    name:['', [ Validators.required, this.validatorService.isAlphanumeric()],[this.validatorService.dealerNameUnique()]],
    businessName:[''],
    rfc: ['', this.validatorService.isRfc(false)],
    postCode:[null,[Validators.min(10000), Validators.max(99999)]],
    state: this.stateControl,
    city: this.cityControl,
    street: [''],
    neighborhood: [''],
    dealerGroup: this.dealerGroupControl,
    terchief: this.terchiefControl,
    workshop: this.workshopControl,
    status:[1]
  });

  dealerGroups: DealerGroup[] = [];
  terchiefs: Terchief[] = [];
  workshops: Workshop[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dealerService: DealersService,
    private location: Location,
    private messageService: MessageService,
    private validatorService: ValidatorService,
    public validationService: ValidationService
  ) { }

  ngOnInit(): void {
    const dealerEdit: Dealer = this.route.snapshot.data["data"]["dealer"];
    if (dealerEdit) {
      this.id = dealerEdit.id!;
      this.dealerForm?.get("dealerNumber")?.clearAsyncValidators();
      this.dealerForm?.get("dealerNumber")?.setAsyncValidators(this.validatorService.dealerNameUnique(dealerEdit.dealerNumber));
      this.dealerForm?.get("dealerNumber")?.updateValueAndValidity();
      this.dealerForm?.get("name")?.clearAsyncValidators();
      this.dealerForm?.get("name")?.setAsyncValidators(this.validatorService.dealerNameUnique(dealerEdit.name));
      this.dealerForm?.get("name")?.updateValueAndValidity();
      this.dealerForm.reset(dealerEdit);
      this.dealerForm?.markAllAsTouched();
    }
    this.validationService.form = this.dealerForm;
  }

  showContacts(){
    this.displayContacts = true;
  }

  submit(){
    if (!this.id) {
      this.dealerService
        .addDealer(this.dealerForm.value)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dealer saved successfully',
          });
          this.location.back();
        });
    } else {
      this.dealerService
        .editDealer(this.dealerForm.value, this.id)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dealer updated successfully',
          });
          this.location.back();
        });
    }
  }

}
