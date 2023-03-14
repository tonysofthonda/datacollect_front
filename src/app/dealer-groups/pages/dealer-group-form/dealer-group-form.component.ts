import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DealerGroup } from '@models/dealer-group.model';
import { DealerGroupsService } from '@services/dealer-groups/dealer-groups.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dealer-groups-form',
  templateUrl: './dealer-group-form.component.html',
})
export class DealerGroupFormComponent implements OnInit {
  id!: number;
  submited: boolean = false;
  dealerGroupForm = this.fb.group({
    name: ['', [Validators.required, this.validatorService.isAlphabetic2()], this.validatorService.dealerGroupNameUnique()],
    status: [1],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dealerGroupsService: DealerGroupsService,
    private location: Location,
    private messageService: MessageService,
    private validatorService: ValidatorService,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
    const dealerGroupEdit: DealerGroup = this.route.snapshot.data["dealerGroup"];
    if (dealerGroupEdit) {
      this.id = dealerGroupEdit.id!;
      this.dealerGroupForm.reset(dealerGroupEdit);
      this.dealerGroupForm.markAllAsTouched();
      this.dealerGroupForm.get('name')?.clearAsyncValidators();
      this.dealerGroupForm.get('name')?.setAsyncValidators(this.validatorService.dealerGroupNameUnique(dealerGroupEdit.name));
      this.dealerGroupForm.get('name')?.updateValueAndValidity();
    }
    this.validationService.form = this.dealerGroupForm;
  }

  public submit() {
    this.submited = true;
    if (!this.id) {
      this.dealerGroupsService
        .addDealerGroup(this.dealerGroupForm.value)
        .pipe(catchError(()=>{
          this.submited = false;
          return of();
        }))
        .subscribe(() => {
          this.submited = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Dealer Group saved successfully',
            detail: 'Success',
          });
          this.location.back();
        });
    } else {
      this.dealerGroupsService
        .editDealerGroup(this.dealerGroupForm.value, this.id)
        .pipe(catchError(()=>{
          this.submited = false;
          return of();
        }))
        .subscribe(() => {
          this.submited = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Dealer Group updated successfully',
            detail: 'Success',
          });
          this.location.back();
        });
    }
  }
}
