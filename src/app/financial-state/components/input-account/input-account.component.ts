import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormControl, FormGroupDirective } from '@angular/forms';
import { Account, AccountError, AccountValue } from '@models/account.model';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { extractFormulaDesc } from 'src/app/helpers/util';

@Component({
  selector: 'app-input-account',
  templateUrl: './input-account.component.html',
  styleUrls: ['./input-account.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputAccountComponent implements OnInit {
  @Input()
  account!: Account;
  @Input()
  accountValue!: AccountValue;
  @Input()
  control!: AbstractControl;
  @Input()
  inputGroup: boolean = false;
  @Input()
  showError: boolean = false;
  @Input()
  errorMessage: string = "";
  @Input()
  readonly: boolean = false;

  errorPreviousSelected: AccountError | undefined = undefined;

  errorControl: FormControl = this.fb.control(false);

  get isValueSaved(){
    return this.financialStateFormService.savedValues.some(value=>value.accountValue.id === this.accountValue.id);
  }

  get tooltipText(){
    return this.errorPreviousSelected ? "Esta cuenta fue marcada en una revision previa" : "";
  }

  constructor(public financialStateFormService: FinancialStateFormService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.errorControl.valueChanges.subscribe(check=>{
      if(check){
        const value = this.financialStateFormService.savedValues.find(finValue=>finValue.accountValue.id === this.accountValue.id)!;
        this.financialStateFormService.addAccountWithError(value,value.value)
      }else{
        this.financialStateFormService.removeAccountWithError(this.accountValue)
      }
    });

    this.errorPreviousSelected = this.financialStateFormService.accountErrorsPreviousSelected.find(acError => acError.accountValue.accountValue.id === this.accountValue.id);
    if(this.errorPreviousSelected){
      this.errorControl.setValue(true);
      this.errorControl.disable();
    }
  }

  formulaDesc(accountValue: AccountValue): string{
    return extractFormulaDesc(accountValue)
  }
}
