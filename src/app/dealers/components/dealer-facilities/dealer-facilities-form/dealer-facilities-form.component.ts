import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DealerFacility } from '@models/dealer-facility.model';
import { Dealer } from '@models/dealer.model';
import { DealerFacilitiesService } from '@services/dealer-facilities/dealer-facilities.service';
import { DealersService } from '@services/dealers/dealers.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dealer-facilities-form',
  templateUrl: './dealer-facilities-form.component.html',
  providers: [ValidationService]
})
export class DealerFacilitiesFormComponent implements OnInit, OnChanges {
  @Output() isSubmited = new EventEmitter<{value: boolean} | null>();
  @Input() dealerFacilityEdit!: DealerFacility | null;
  dealer!: Dealer;
  facilityId!: number | undefined;

  facilityControl = this.fb.control(null, Validators.required)

  dealerFacilityForm = this.fb.group({
    dealer: [null, [Validators.required]],
    facility: this.facilityControl,
    quantity: [null, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private dealerFacilityService: DealerFacilitiesService,
    private dealerService: DealersService,
    private location: Location,
    private validatorService: ValidatorService,
    public validationService: ValidationService) { }

  ngOnInit(): void {
    const dealerId = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.dealerService.getDealer(dealerId)
    .pipe(catchError(() => {
      this.location.back();
      return of();
    }))
    .subscribe(dealer =>{
      this.dealer = dealer;
      this.facilityControl.clearAsyncValidators();
      this.facilityControl.addAsyncValidators(this.validatorService.dealerFacilityUnique(this.dealer.id || -1));
      this.facilityControl.updateValueAndValidity();
      this.dealerFacilityForm.get('dealer')?.reset(dealer);
    })
    this.validationService.form = this.dealerFacilityForm;
  }

  ngOnChanges(): void {
    if (this.dealerFacilityEdit) {
      this.facilityId = this.dealerFacilityEdit.facility.id;
      this.facilityControl.clearAsyncValidators();
      this.facilityControl.addAsyncValidators(this.validatorService.dealerFacilityUnique(this.dealer.id || -1, this.facilityId));
      this.facilityControl.updateValueAndValidity();
      this.dealerFacilityForm.reset(this.dealerFacilityEdit);
      this.dealerFacilityForm.get('facility')?.disable();
    } else{
      this.resetForm();
      this.dealerFacilityForm.get('facility')?.enable();
    }
  }

  public cancelEdit() {
    this.stopEdit(false);
  }

  public stopEdit(submited: boolean){
    this.facilityId = undefined;
    this.resetForm();
    this.isSubmited.emit({value: submited});
  }

  resetForm(){
    this.dealerFacilityForm.get('facility')?.reset();
    this.dealerFacilityForm.get('quantity')?.reset();
  }


  submit(){
    if (!this.facilityId) {
      this.dealerFacilityService
        .addDealerFacility(this.dealerFacilityForm.value)
        .subscribe(() => {
          this.isSubmited.emit({value: true});
          this.resetForm();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dealer Facility saved successfully',
          });
        });
    } else {
      this.dealerFacilityService
        .editDealerFacility(this.dealerFacilityForm.getRawValue())
        .subscribe(() => {
          this.stopEdit(true)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dealer Facility updated successfully',
          });
        });
    }
  }
}
