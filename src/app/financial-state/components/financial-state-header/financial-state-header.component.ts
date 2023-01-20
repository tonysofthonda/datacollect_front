import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FinancialState } from '@models/financial-state.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { getDateAsText, getLastFinancialStateStatus, getMonthTextByNumber } from 'src/app/helpers/util';

@Component({
  selector: 'app-financial-state-header',
  templateUrl: './financial-state-header.component.html'
})
export class FinancialStateHeaderComponent implements OnInit {
  @Input() financialState!: FinancialState;
  @Input() invalidFinancialState!: boolean;

  @Output() save = new EventEmitter<any>();
  @Output() send = new EventEmitter<any>();
  @Output() approve = new EventEmitter<any>();
  @Output() reject = new EventEmitter<any>();
  @Output() observations = new EventEmitter<any>();

  get sendTooltip(){
    if(this.invalidFinancialState){
      return "Hay cuentas con valores sin guardar o valores invalidos en el estado financiero";
    }else{
      return "Envia tu estado financiero para ser evaluado";
    }
  }

  get approveTooltip(){
    if(this.financialStateFormService.enableApprove){
      return "Aprueba este estado financiero";
    }else{
      return "Hay cuentas marcadas como error, por lo cual no se puede aprobar";
    }
  }


  get lastStatus(){
    return getLastFinancialStateStatus(this.financialState);
  }

  get financialStateDate(){
    return `${getMonthTextByNumber(this.financialState.month, 'es-MX')}/${this.financialState.year}`;
  }

  get limitDate(){
    return getDateAsText(new Date(this.financialState.limitDate));
  }

  constructor(public financialStateFormService: FinancialStateFormService) { }

  ngOnInit(): void {
  }

  handleSave(event: any){
    this.save.emit(event);
  }

  handleSend(event: any){
    this.send.emit(event);
  }

  handleApprove(event: any){
    this.approve.emit(event);
  }

  handleReject(event: any){
    this.reject.emit(event);
  }

  handleObservations(event: any){
    this.observations.emit(event);
  }

}
