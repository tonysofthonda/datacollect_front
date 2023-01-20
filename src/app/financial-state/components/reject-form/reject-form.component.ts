import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FinancialState } from '@models/financial-state.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { FinancialStateService } from '@services/financial-state/financial-state.service';
import { ValidationService } from '@services/validation/validation.service';
import { MessageService } from 'primeng/api';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'app-reject-form',
  templateUrl: './reject-form.component.html',
  providers: [ValidationService]
})
export class RejectFormComponent implements OnInit, AfterViewInit {

  @ViewChild('calendar')
  calendar!: Calendar;

  financialState!: FinancialState;

  rejectForm = this.fb.group({
    limitDate:[null, Validators.required],
    reason:['', Validators.required]
  });

  minDate: Date = new Date();

  maxDate: Date = new Date();

  constructor(private messageService: MessageService,private route: ActivatedRoute,private location: Location,private financialStateService:FinancialStateService,public validationService: ValidationService,private fb: FormBuilder,public financialStateFormService: FinancialStateFormService) { }

  ngOnInit(): void {
    this.financialState = this.route.snapshot.data["data"]["financialState"];
    this.validationService.form = this.rejectForm;

    const {month,year,limitDate} = this.financialState;

    const currentLimitDate = new Date(`${year}-${month}-${new Date(limitDate).getDate() + 1}`);
    const currentDate = new Date();
    if(currentDate < currentLimitDate){
      this.minDate = currentLimitDate;
    }else{
      this.minDate = currentDate;
    }
    this.maxDate = new Date(year, month, 0);
  }

  ngAfterViewInit(): void {
    this.calendar.registerOnChange((value: Date)=>{
      if(value){
        const day = value.getDate();
        const month = value.getMonth() + 1;
        const year = value.getFullYear();
        this.rejectForm.get("limitDate")?.setValue(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      }
    })
  }

  handleSubmit(){
    this.financialStateService.rejectFinancialState(this.financialState.id!, this.rejectForm.get("reason")?.value, this.financialStateFormService.accountErrors, this.rejectForm.get("limitDate")?.value).subscribe(()=>{
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Estado financiero rechazado',
      });
      this.location.back();
    });
  }

}
