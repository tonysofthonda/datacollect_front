import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountComponentEnum } from '@enums/account-component.enum';
import { Account, AccountRelationship, AccountValue } from '@models/account.model';
import { FinancialState } from '@models/financial-state.model';
import { AccountService } from '@services/accounts/account.service';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { ValidatorService } from '@services/validation/validator.service';
import { of, Subscription } from 'rxjs';
import { FinancialStateFormGroup } from '../../models/filter-financial-state-form.model';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styles: [
  ]
})
export class PageComponent implements OnInit, OnChanges {

  @Output() onValuesChange = new EventEmitter<FinancialStateFormGroup>();
  @Input() page!: string;
  @Input() indexTab!: number;
  @Input() mainAccounts: Account[] = [];

  loading: boolean = false;
  accountRels: AccountRelationship[] = [];
  accountValues: AccountValue[] = [];
  financialState!: FinancialState;
  fetchAccounts!:Subscription;

  @Input()
  pageForm!: FormGroup;

  get accountComponent(): typeof AccountComponentEnum{
    return AccountComponentEnum;
  }

  constructor(
    private accountService: AccountService,
    private validatorService: ValidatorService,
    private router: ActivatedRoute,
    private financialStateFormService: FinancialStateFormService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.financialState = this.router.snapshot.data["data"]["financialState"];
    this.pageForm.valueChanges.subscribe(()=>{
      this.onValuesChange.emit({form:this.pageForm,indexTab: this.indexTab,accountValues: this.accountValues});
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(!this.pageForm){
        this.pageForm = this.fb.group({});
      }
  }

  async showAccounts(show:boolean, parentAccountId: number){
    if(show){
      this.fetchAccounts = await this.getChildrenAccounts(parentAccountId);
    }else if(this.fetchAccounts){
      this.fetchAccounts.unsubscribe();
    }
  }

  async getChildrenAccounts(parentAccountId: number){
    this.loading = true;

    const storageChildrenAccounts = await this.financialStateFormService.getChildrenByAccount(parentAccountId);
    if(storageChildrenAccounts){
      this.addAccountsToForm(storageChildrenAccounts);
      this.accountRels = storageChildrenAccounts;
      this.loading = false;
      return of(storageChildrenAccounts).subscribe();
    }else{
      return this.accountService.getChildrenAccounts(parentAccountId)
    .subscribe(async (accountRels)=>{
      await this.financialStateFormService.addChildrenAccounts(parentAccountId, accountRels);
      this.addAccountsToForm(accountRels);
      this.accountRels = accountRels;
      this.loading = false;
    });
    }
  }

  addAccountsToForm(accountRels: AccountRelationship[]){
    const children = accountRels.map(rel=>rel.child);
    
    for (const child of children) {
      for (const {id,...accountValue} of child.accountValues!) {
        this.accountValues.push({id,...accountValue, account: child});
        if(this.pageForm.get(id!.toString())){
          break;
        }
        const finAccountValue = this.financialState.accountValues.find(value=>value.accountValue.id === id);        
        const control = this.fb.control(finAccountValue?.value || accountValue.defaultValue ||'0',this.validatorService.isAccountValue(accountValue.required));
        if(accountValue.readOnly){
          control.disable();
        }
        this.pageForm.addControl(id!.toString(),control);
      }
      if(child.relationshipCheck.hasChildren){
        this.addAccountsToForm(child.children);
      }
    }
  }

}
