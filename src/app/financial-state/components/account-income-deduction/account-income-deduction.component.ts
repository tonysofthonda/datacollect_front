import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Account, AccountValue, TypeAccountValue } from '@models/account.model';
import { FinancialState } from '@models/financial-state.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { ValidationService } from '@services/validation/validation.service';
import { extractFormulaDesc, extractTypeAccountValuesOfRelationship, flatAccountRelationship, getAccountValueByTypeAccount } from 'src/app/helpers/util';

@Component({
  selector: 'app-account-income-deduction',
  templateUrl: './account-income-deduction.component.html',
  styles: [
  ]
})
export class AccountIncomeDeductionComponent implements OnInit {
  @Input() account!: Account;
  @Input() formGroup!: FormGroup;

  typeValues: TypeAccountValue[] = [];
  accounts: Account[] = [];
  financialState!: FinancialState;

  constructor(public validationService: ValidationService, public financialStateFormService: FinancialStateFormService,private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.validationService.form = this.formGroup;
    this.typeValues = extractTypeAccountValuesOfRelationship(this.account);
    this.accounts = flatAccountRelationship(this.account).filter(account=> account.id !== this.account.id);
    this.financialState = this.router.snapshot.data["data"]["financialState"];
  }

  formulaDesc(accountValue: AccountValue): string{
    return extractFormulaDesc(accountValue)
  }

  getAccountValue(account: Account, typeValue: TypeAccountValue){
    return getAccountValueByTypeAccount(account,typeValue);
  }
}
