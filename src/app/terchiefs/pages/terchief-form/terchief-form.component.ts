import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { TerchiefsService } from '@services/terchiefs/terchiefs.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Terchief } from '@models/terchief.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-terchief-form',
  templateUrl: './terchief-form.component.html',
})
export class TerchiefFormComponent implements OnInit {
  id!: number;
  displayContacts: boolean = false;
  submited: boolean = false;
  terchiefForm = this.fb.group({
    firstName: [
      '',
      [Validators.required, this.validatorService.isAlphabetic()],
    ],
    lastName: ['', [Validators.required, this.validatorService.isAlphabetic()]],
    motherLastName: ['', this.validatorService.isAlphabetic(false)],
    notes: ['', this.validatorService.isAlphanumeric(false)],
  });


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private terchiefsService: TerchiefsService,
    private location: Location,
    private messageService: MessageService,
    private validatorService: ValidatorService,
    public validationService: ValidationService
  ) {}

  ngOnInit() {
    const terchiefEdit: Terchief = this.route.snapshot.data["terchief"];
    if (terchiefEdit) {
        this.id = terchiefEdit.id!;
        this.terchiefForm.reset(terchiefEdit);
        this.terchiefForm.markAllAsTouched();
    }
    this.validationService.form = this.terchiefForm;
  }

  public submit() {
    this.submited = true;
    if (!this.id) {
      this.terchiefsService
        .addTerchief(this.terchiefForm.value)
        .pipe(catchError(()=>{
          this.submited = false;
          return of();
        }))
        .subscribe(() => {
          this.submited = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Head Of Territory saved successfully',
          });
          this.location.back();
        });
    } else {
      this.terchiefsService
        .editTerchief(this.terchiefForm.value, this.id)
        .pipe(catchError(()=>{
          this.submited = false;
          return of();
        }))
        .subscribe(() => {
          this.submited = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Head Of Territory updated successfully',
          });
          this.location.back();
        });
    }
  }

  public showContacts() {
    this.displayContacts = true;
  }
}
