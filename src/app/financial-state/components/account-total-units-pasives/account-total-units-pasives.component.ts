import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Account, AccountValue, FinancialStateAccountValue, TypeAccountValue } from '@models/account.model';
import { FinancialState } from '@models/financial-state.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { ValidationService } from '@services/validation/validation.service';
import { extractFormulaDesc, extractMainTypeAccountValues, extractTypeAccountValuesOfRelationship, flatAccountRelationship, getAccountValueByTypeAccount } from 'src/app/helpers/util';

@Component({
  selector: 'app-account-total-units-pasives',
  templateUrl: './account-total-units-pasives.component.html',
  providers: [ValidationService]
})
export class AccountTotalUnitsPasivesComponent implements OnInit {
  @Input() account!: Account;
  @Input() formGroup!: FormGroup;

  typeValues: TypeAccountValue[] = [];
  headerTypeValues: TypeAccountValue[] = [];
  accounts: Account[] = [];
  financialState!: FinancialState;

  get totalHeaderRows(){
    return Math.max(...this.headerTypeValues.map(typeValue=>typeValue.children?.length || 0));
  }

  constructor(public validationService: ValidationService,public financialStateFormService: FinancialStateFormService,private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.validationService.form = this.formGroup;
    this.typeValues = extractTypeAccountValuesOfRelationship(this.account);
    this.headerTypeValues = extractMainTypeAccountValues(this.typeValues);
    this.accounts = flatAccountRelationship(this.account);
    this.financialState = this.router.snapshot.data["data"]["financialState"];

    const lastMonthValues: FinancialStateAccountValue[] = this.router.snapshot.data["data"]["totalUnitsPasives"];
    lastMonthValues.forEach(value=>{
      const alreadyRegistered = this.financialState.accountValues.some(currentValue => currentValue.accountValue.id === value.accountValue.id);
      if(!alreadyRegistered){
        this.formGroup.get(value.accountValue.id!.toString())?.setValue(value.value);
      }
    });
  }

  rowSpan(typeAccountValue: TypeAccountValue){
    if(typeAccountValue.children){
      return 1;
    }
    if(this.totalHeaderRows == 2){
      return this.totalHeaderRows;
    }
    return Math.ceil(this.totalHeaderRows / 2);
  }

  formulaDesc(accountValue: AccountValue): string{
    return extractFormulaDesc(accountValue)
  }

  getAccountValue(account: Account, typeValue: TypeAccountValue){
    return getAccountValueByTypeAccount(account,typeValue);
  }

  inputMonthReadOnly(account: Account): boolean{
    if(!account.accountNumber?.startsWith("M")){
      return false;
    }
    const monthNumber = parseInt(account.accountNumber.replace("M",""));
    return monthNumber !== this.financialState.month;
  }
}
