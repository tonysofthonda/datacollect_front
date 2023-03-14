import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FacilitiesService } from '@services/facilities/facilities.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { MessageService } from 'primeng/api';
import { Facility } from "@models/facility.model";
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-facility-form',
  templateUrl: './facility-form.component.html',
})
export class FacilityFormComponent implements OnInit {
  id!: number;
  submited: boolean = false;
  facilityForm = this.fb.group({
    concept: ['',[Validators.required, this.validatorService.isAlphabetic2() ]],
    description: ['',[Validators.required]],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private facilitiesService: FacilitiesService,
    private location: Location,
    private messageService: MessageService,
    private validatorService: ValidatorService,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
    const facilityEdit: Facility = this.route.snapshot.data["facility"];
    if (facilityEdit) {
      this.id = facilityEdit.id!;
      this.facilityForm.reset(facilityEdit);
      this.facilityForm.markAllAsTouched();
    }
    this.validationService.form = this.facilityForm;
  }

  public submit() {
    this.submited = true;
    if (!this.id) {
      this.facilitiesService
        .addFacility(this.facilityForm.value)
        .pipe(catchError(()=>{
          this.submited = false
          return of();
        }))
        .subscribe(() => {
          this.submited = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Facility saved successfully',
            detail: 'Success',
          });
          this.location.back();
        });
    } else {
      this.facilitiesService
        .editFacility(this.facilityForm.value, this.id)
        .pipe(catchError(()=>{
          this.submited = false
          return of();
        }))
        .subscribe(() => {
          this.submited = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Facility updated successfully',
            detail: 'Success',
          });
          this.location.back();
        });
    }
  }
}
