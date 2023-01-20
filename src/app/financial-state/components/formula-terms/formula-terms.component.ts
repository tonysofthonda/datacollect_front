import { Component, Input, OnInit } from '@angular/core';
import { FinancialStateFormGroup } from '../../models/filter-financial-state-form.model';
import { extractFormulaDesc } from 'src/app/helpers/util';
import { AccountValue, FinancialStateAccountValue } from '@models/account.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';

@Component({
  selector: 'app-formula-terms',
  templateUrl: './formula-terms.component.html',
  styleUrls: ['./formula-terms.component.scss']
})
export class FormulaTermsComponent implements OnInit {

  @Input() forms: (FinancialStateFormGroup | null)[] = [];
  @Input() savedValues: FinancialStateAccountValue[] = [];


  get formulaHeader(){
    if(this.formula?.ownerAccount){
      const {account,typeValue} = this.formula?.ownerAccount!;
      return `Formula de ${typeValue.name} de ${account.name || (account.model && 'Modelo ' + account.model?.name) || 'campo desconocido'}`
    }else{
      return 'Formula de campo desconocido'
    }
  }

  get formula(){
    return this.financialStateFormService.formulaFocus;
  }

  get accountsValues(){
    return this.forms.filter(form=>form !== null).map(form=>form?.accountValues || []).flat(1).filter(acValue=> this.formula?.terms.some(acValueTerm=>acValueTerm.accountTerm.id === acValue?.id));
  }

  constructor(private financialStateFormService: FinancialStateFormService) { }

  ngOnInit(): void {
  }

  getFormValue(id: number){
    const formValue = this.forms.filter(form=>form !== null).filter(form=>form?.accountValues.some(acValue=>acValue.id === id))[0]?.form.value[id];
    if(formValue){
      return formValue;
    }else{
      return this.savedValues.find(value=>value.accountValue.id === id)?.value || "0";
    }
  }

  formulaDesc(accountValue: AccountValue): string{
    return extractFormulaDesc(accountValue)
  }

  getNameAccount(accountValue: AccountValue){
    return `${accountValue.typeValue.name} de ${accountValue.account?.name || accountValue.account?.model?.name || accountValue.account?.accountNumber || 'Campo desconocido'}`
  }

  close(){
    this.financialStateFormService.formulaFocus = null;
  }

}
