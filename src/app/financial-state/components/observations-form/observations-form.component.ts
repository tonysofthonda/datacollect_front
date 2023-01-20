import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FinancialState } from '@models/financial-state.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { FinancialStateService } from '@services/financial-state/financial-state.service';
import { ValidationService } from '@services/validation/validation.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-observations-form',
  templateUrl: './observations-form.component.html',
  providers: [ValidationService]
})
export class ObservationsFormComponent implements OnInit {

  financialState!: FinancialState;

  observationsForm = this.fb.group({
    reason:['', Validators.required]
  });


  constructor(private messageService: MessageService,private route: ActivatedRoute,private location: Location,private financialStateService:FinancialStateService,public validationService: ValidationService,private fb: FormBuilder,public financialStateFormService: FinancialStateFormService) { }

  ngOnInit(): void {
    this.financialState = this.route.snapshot.data["data"]["financialState"];
    this.validationService.form = this.observationsForm;
  }

  handleSubmit(){
    this.financialStateService.observationsFinancialState(this.financialState.id!, this.observationsForm.get("reason")?.value).subscribe(()=>{
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Observaciones agregadas al Estado Financiero',
      });
      this.location.back();
    });
  }
}
