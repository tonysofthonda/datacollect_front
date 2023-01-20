import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Account, AccountValue, TypeAccountValue } from '@models/account.model';
import { FinancialState } from '@models/financial-state.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { ValidationService } from '@services/validation/validation.service';
import { extractFormulaDesc, extractMainTypeAccountValues, extractTypeAccountValuesOfRelationship, flatAccountRelationship, getAccountValueByTypeAccount } from 'src/app/helpers/util';

@Component({
  selector: 'app-account-receivable-analysis',
  templateUrl: './account-receivable-analysis.component.html',
  providers: [ValidationService]
})
export class AccountReceivableAnalysisComponent implements OnInit {
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
}
