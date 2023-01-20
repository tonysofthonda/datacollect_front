import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Account, AccountValue } from '@models/account.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { ValidationService } from '@services/validation/validation.service';
import { extractFormulaDesc } from 'src/app/helpers/util';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  providers: [ValidationService],
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  @Input() account!: Account;
  @Input() parent!: Account;

  @Input() formGroup!: FormGroup;

  constructor(public validationService: ValidationService, public financialStateFormService: FinancialStateFormService) { }

  ngOnInit(): void {
    this.validationService.form = this.formGroup;
  }


  formulaDesc(accountValue: AccountValue): string{
    return extractFormulaDesc(accountValue)
  }

}
