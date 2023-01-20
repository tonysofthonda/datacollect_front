import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Account, AccountValue, TypeAccountValue } from '@models/account.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { ValidationService } from '@services/validation/validation.service';
import { extractFormulaDesc, extractTypeAccountValuesOfRelationship, flatAccountRelationship, getAccountValueByTypeAccount } from 'src/app/helpers/util';

@Component({
  selector: 'app-account-total-fixed-assets',
  templateUrl: './account-total-fixed-assets.component.html',
  providers: [ValidationService]
})
export class AccountTotalFixedAssetsComponent implements OnInit {

  @Input() account!: Account;
  @Input() formGroup!: FormGroup;

  typeValues: TypeAccountValue[] = [];
  accounts: Account[] = [];
  constructor(public validationService: ValidationService, public financialStateFormService: FinancialStateFormService) { }

  ngOnInit(): void {
    this.validationService.form = this.formGroup;
    this.typeValues = extractTypeAccountValuesOfRelationship(this.account);
    this.accounts = flatAccountRelationship(this.account);
  }

  formulaDesc(accountValue: AccountValue): string{
    return extractFormulaDesc(accountValue)
  }

  getAccountValue(account: Account, typeValue: TypeAccountValue){
    return getAccountValueByTypeAccount(account,typeValue);
  }
}
