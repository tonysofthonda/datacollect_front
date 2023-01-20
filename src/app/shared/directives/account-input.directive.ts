import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FinancialStateStatusEnum } from '@enums/financial-state-status.enum';
import { Account, AccountValue } from '@models/account.model';
import { FinancialState } from '@models/financial-state.model';
import { accountValueParenthesesPattern, accountValueNumberPattern, accountValueNegativePattern, accountValueInputPattern } from '@regex';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { Subject, Subscription } from 'rxjs';
import { getLastFinancialStateStatus } from 'src/app/helpers/util';

@Directive({
  selector: '[accountInput]'
})
export class AccountInputDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() account!: Account;
  @Input() accountValue!: AccountValue;
  @Input() control!: AbstractControl;

  input!: HTMLInputElement;
  fieldSubscriptions: Subscription[] = [];
  formulaTermsObserver = new Subject<string[]>();
  termValues: string[] = [];
  financialState!: FinancialState;

  constructor(private element: ElementRef<HTMLInputElement>, private financialStateFormService: FinancialStateFormService,private router: ActivatedRoute) {
   }

   ngOnInit(): void {
      this.input = this.element.nativeElement;
      this.financialState = this.router.snapshot.data["data"]["financialState"];

      const lastStatus = getLastFinancialStateStatus(this.financialState);
      switch(lastStatus?.status.name){
        case FinancialStateStatusEnum.SENT:
        case FinancialStateStatusEnum.LOCKED:
        case FinancialStateStatusEnum.REJECTED:
        case FinancialStateStatusEnum.APPROVED:
          this.input.disabled = true;
          this.input.classList.add("disabled-by-state");
          break;
      }


      this.input.addEventListener('keypress',(event: any)=>{
        const preValue = this.input.value;
        const newChar = String.fromCharCode(event.keyCode);
        const newValue = preValue.substring(0,this.input.selectionStart!) + newChar + preValue.substring(this.input.selectionEnd!);
        if(!accountValueInputPattern.test(newValue)){
          event.preventDefault();
        }
      });

      this.input.addEventListener('input',(event: any)=>{
        this.colorChange(event.target.value);
      });

      if(this.accountValue.formula){
        this.configFormula();
      }
   }

  ngAfterViewInit(): void {
    this.colorChange(this.input.value);
  }

  ngOnDestroy(): void {
    this.financialStateFormService.formulaFocus = null;
  }

  colorChange(value: string){
    if(accountValueNegativePattern.test(value)){
      this.input.style.color = 'red';
    }else{
      this.input.style.color = 'black';
    }
   }

  castNumberTextToNumber(value: string) : number{
    if(accountValueNumberPattern.test(value)){
      return parseFloat(value);
    }else if(accountValueParenthesesPattern.test(value)){
      value = value.replace("(","-");
      value = value.replace(")","");
      return parseFloat(value);
    }else{
      return 0;
    }
  }

  castNumberToNumberText(value: number) : string{
    let stringValue = value.toString();
    if(value < 0){
      stringValue = stringValue.replace("-","(") + ")";
    }
    return stringValue;
  }

  configFormula(){
    this.formulaTermsObserver.asObservable().subscribe(values=>{
      const result = this.castNumberToNumberText(this.computeFormula(values, this.accountValue.formula?.formula!));
      this.colorChange(result);
      const controlSubscription = this.financialStateFormService.controlSubscription.get(this.account.id!);
      const emitEvent = controlSubscription && controlSubscription?.length > 0;
      this.control.patchValue(result, {emitEvent});
    });

    this.accountValue.formula!.terms.forEach((term,i)=>{
      let formControlTerm = this.control.parent?.get(term.accountTerm.id!.toString()) || this.financialStateFormService.forms.filter(form=>form?.form).map(form=>form?.form.controls).reduce((form1,form2)=>({...form1,...form2}))![term.accountTerm.id!.toString()];

      if(formControlTerm){
        this.termValues.push(formControlTerm?.value);
        this.addToControlSubscription(term.accountTerm.id!);
        const subscription = formControlTerm?.valueChanges.subscribe((value)=>{
          this.termValues[i] = value;
          this.formulaTermsObserver.next(this.termValues);
        })!;
        this.fieldSubscriptions.push(subscription);
      }else{
        const value = this.financialState.accountValues.find(value=>value.accountValue.id === term.accountTerm.id);
        if(value){
          this.termValues.push(value?.value);
        }else {
          this.termValues.push("0");
        }
      }
    });
    this.formulaTermsObserver.next(this.termValues);


    this.input.addEventListener("focus",()=>{
      this.financialStateFormService.formulaFocus = {...this.accountValue.formula!,ownerAccount: {...this.accountValue, account: this.account}};
    });
  }

  addToControlSubscription(accountId: number){
    const controlSubscription = this.financialStateFormService.controlSubscription.get(accountId);
    if(controlSubscription){
      this.financialStateFormService.controlSubscription.set(accountId, [...controlSubscription, this.account.id!])
    }else{
      this.financialStateFormService.controlSubscription.set(accountId, []);
    }
  }

  computeFormula(values: string[], formula: string): number{
    const numberValues = values.map(this.castNumberTextToNumber);
    for (const value of numberValues) {
        let newValue = '0';
        if(value < 0){
          newValue = `(${value.toString()})`
        }else{
          newValue = value.toString();
        }
        formula = formula.replace("?", newValue);
    }
    const result = eval(formula);
    if(isNaN(result)){
      return 0;
    }
    return result;
  }
}
