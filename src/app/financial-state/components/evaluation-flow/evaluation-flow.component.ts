import { Component, OnInit } from '@angular/core';
import { FinancialStateStatusEnum } from '@enums/financial-state-status.enum';
import { FinancialStateStatus } from '@models/financial-state.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';

@Component({
  selector: 'app-evaluation-flow',
  templateUrl: './evaluation-flow.component.html',
  styleUrls: ['./evaluation-flow.component.scss']
})
export class EvaluationFlowComponent implements OnInit {

  statusSelected: FinancialStateStatus | null = null;
  showStatusDetails: boolean = false;

  get statuses(){
    return this.financialStateFormService.statuses;
  }

  get enum(){
    return FinancialStateStatusEnum;
  }

  constructor(public financialStateFormService: FinancialStateFormService) { }

  ngOnInit(): void {
  }

  showStatusDetail(status: FinancialStateStatus){
    this.statusSelected = status;
    this.showStatusDetails = true;
  }

  hasDetails(status: FinancialStateStatus){
    return status?.comments;
  }
}
