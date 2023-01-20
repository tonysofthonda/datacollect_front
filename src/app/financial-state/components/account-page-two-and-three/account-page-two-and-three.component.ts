import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TypeAccountValueEnum } from '@enums/type-account-value.enum';
import { Account, AccountValue, FinancialStateAccountValue, TypeAccountValue } from '@models/account.model';
import { FinancialState } from '@models/financial-state.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { ValidationService } from '@services/validation/validation.service';
import { extractFormulaDesc, extractMainTypeAccountValues, extractTypeAccountValuesOfRelationship, flatAccountRelationship, getAccountValueByTypeAccount } from 'src/app/helpers/util';

@Component({
  selector: 'app-account-page-two-and-three',
  templateUrl: './account-page-two-and-three.component.html',
  providers: [ValidationService]
})
export class AccountPageTwoAndThreeComponent implements OnInit {
  @Input() account!: Account;
  @Input() formGroup!: FormGroup;

  typeValues: TypeAccountValue[] = [];
  headerTypeValues: TypeAccountValue[] = [];
  accounts: Account[] = [];
  financialState!: FinancialState;

  get totalHeaderRows(){
    return Math.max(...this.headerTypeValues.map(typeValue=>typeValue.children?.length || 0));
  }

  constructor(public validationService: ValidationService, public financialStateFormService: FinancialStateFormService,private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.validationService.form = this.formGroup;
    this.typeValues = extractTypeAccountValuesOfRelationship(this.account);
    this.headerTypeValues = extractMainTypeAccountValues(this.typeValues);
    //Order type values by parent
    this.typeValues = [];
    for (const mainTypeValues of this.headerTypeValues) {
      const children = mainTypeValues.children.map(child=>child.child);
      this.typeValues = [...this.typeValues,...children];
    }
    this.accounts = flatAccountRelationship(this.account).filter(account=> account.id !== this.account.id);
    this.financialState = this.router.snapshot.data["data"]["financialState"];


    const historicalPage2and3: FinancialStateAccountValue[] = this.router.snapshot.data["data"]["historicalPage2and3"];
    this.configHistoricalAccounts(historicalPage2and3);
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

  configHistoricalAccounts(historicalPage2and3: FinancialStateAccountValue[]){
    historicalPage2and3.forEach(value=>{
      const alreadyRegistered = this.financialState.accountValues.some(currentValue => currentValue.accountValue.id === value.accountValue.id);
      this.formGroup.get(value.accountValue.id!.toString())?.enable();
      if(!alreadyRegistered){
        this.formGroup.get(value.accountValue.id!.toString())?.reset(value.value);
      }

      this.accounts = this.accounts.map(account=>{
        account.accountValues = account.accountValues?.map((acValue)=>{
          if(acValue.id === value.accountValue.id){
            const currentMonthAccountValue = this.accounts.find(acc=>acc.id===account.id)?.accountValues!.find(currMonthAcValue=> currMonthAcValue.typeValue.name === TypeAccountValueEnum.MONTH && currMonthAcValue.typeValue.parent.parent.name === acValue.typeValue.parent.parent.name)!;
            acValue.formula = {ownerAccount:acValue, formula: `?+${value.value}`, terms: [{accountTerm:{...currentMonthAccountValue, account},order:1}]}
          }
          return acValue;
        });
        return account;
      });
    })

  }

}
