import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StaticAccountEnum } from '@enums/static-account.enum';
import { TypeAccountValueEnum } from '@enums/type-account-value.enum';
import { Account, AccountValue, FinancialStateAccountValue, TypeAccountValue } from '@models/account.model';
import { FinancialState } from '@models/financial-state.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { ValidationService } from '@services/validation/validation.service';
import { extractFormulaDesc, extractMainTypeAccountValues, extractTypeAccountValuesOfRelationship, flatAccountRelationship, getAccountValueByTypeAccount, setAccountToAccountValue } from 'src/app/helpers/util';

@Component({
  selector: 'app-account-gross-profit-analysis',
  templateUrl: './account-gross-profit-analysis.component.html',
  providers: [ValidationService]
})
export class AccountGrossProfitAnalysisComponent implements OnInit {
  @Input() account!: Account;
  @Input() formGroup!: FormGroup;

  typeValues: TypeAccountValue[] = [];
  headerTypeValues: TypeAccountValue[] = [];
  accounts: Account[] = [];
  financialState!: FinancialState;

  private accountValues: AccountValue[] = [];

  get totalHeaderRows(){
    return Math.max(...this.headerTypeValues.map(typeValue=>typeValue.children?.length || 0));
  }

  constructor(public validationService: ValidationService, public financialStateFormService: FinancialStateFormService,private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.validationService.form = this.formGroup;
    this.typeValues = extractTypeAccountValuesOfRelationship(this.account);
    this.headerTypeValues = extractMainTypeAccountValues(this.typeValues);
    this.accounts = flatAccountRelationship(this.account).filter(account=> account.id !== this.account.id);
    this.accounts = this.accounts.filter(account=>account.name!==StaticAccountEnum.MODELS);

    const modelsAccounts = this.accounts.filter(account=>account.model);
    const accountsWithoutModels = this.accounts.filter(account=>!account.model);
    this.accounts = [...modelsAccounts,...accountsWithoutModels];
    this.accountValues = this.accounts.map(account => account.accountValues?.map(acValue => {
      acValue.account = account;
      return acValue;
    }) || []).flat(1);
    this.financialState = this.router.snapshot.data["data"]["financialState"];

    const historicalPage4: FinancialStateAccountValue[] = this.router.snapshot.data["data"]["historicalPage4"];
    this.configHistoricalAccounts(historicalPage4);
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

  configHistoricalAccounts(historicalPage4: FinancialStateAccountValue[]){
    historicalPage4.forEach(value=>{
      const alreadyRegistered = this.financialState.accountValues.some(currentValue => currentValue.accountValue.id === value.accountValue.id);
      this.formGroup.get(value.accountValue.id!.toString())?.enable();
      if(!alreadyRegistered){
        this.formGroup.get(value.accountValue.id!.toString())?.reset(value.value);
      }

      this.accounts = this.accounts.map(account=>{
        account.accountValues = account.accountValues?.map((acValue)=>{
          if(acValue.id === value.accountValue.id && acValue.typeValue.name !== TypeAccountValueEnum.PERCENTAGE_SOLD_UNITS){
            const currentMonthAccountValue = this.accounts.find(acc=>acc.id===account.id)?.accountValues!.find(currMonthAcValue=> currMonthAcValue.typeValue.parent.parent.name === TypeAccountValueEnum.CURRENT_MONTH && currMonthAcValue.typeValue.name === acValue.typeValue.name)!;
            acValue.formula = {ownerAccount:acValue, formula: `?+${value.value}`, terms: [{accountTerm:currentMonthAccountValue,order:1}]}
          }
          return acValue;
        });
        return account;
      });
    })

  }
}
