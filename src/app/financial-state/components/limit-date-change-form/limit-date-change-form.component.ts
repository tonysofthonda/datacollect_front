import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FinancialState } from '@models/financial-state.model';
import { FinancialStateService } from '@services/financial-state/financial-state.service';

@Component({
  selector: 'app-limit-date-change-form',
  templateUrl: './limit-date-change-form.component.html',
  styles: [
  ]
})
export class LimitDateChangeFormComponent implements OnInit {

  @Input() financialStateSelected: FinancialState[] = [];

  @Output() onCloseForm = new EventEmitter<boolean>();

  newLimitDate: Date = new Date();
  minDate: Date = new Date();
  constructor(private financialStateService: FinancialStateService) { }

  ngOnInit(): void {
  }

  onSaveNewLimitDate(){
    this.financialStateService.updateFinancialStatesLimitDate(this.financialStateSelected, this.newLimitDate).subscribe(()=>{
      this.onCloseForm.emit(true);
    })
  }

}
