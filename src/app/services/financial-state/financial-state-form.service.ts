import { Injectable } from '@angular/core';
import { FinancialStateStatusEnum } from '@enums/financial-state-status.enum';
import { Account, AccountError, AccountRelationship, AccountValue, FinancialStateAccountValue, Formula } from '@models/account.model';
import { FinancialStateStatus } from '@models/financial-state.model';
import { liveQuery } from 'dexie';
import { db } from "src/app/shared/local-db/db"
import { getLastFinancialStateStatus } from 'src/app/helpers/util';
import { FinancialStateFormGroup } from 'src/app/financial-state/models/filter-financial-state-form.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialStateFormService {

  public formulaFocus: Formula | null = null;
  public accountErrors: AccountError[] = [];
  public accountErrorsPreviousSelected: AccountError[] = [];
  public savedValues: FinancialStateAccountValue[] = [];
  public statuses: FinancialStateStatus[] = [];
  public loadingSave: boolean = false;
  public loadingSend: boolean = false;
  public forms: (FinancialStateFormGroup | null)[] = [];
  public controlSubscription = new Map<number, number[]>();

  public enableApprove: boolean = true;

  private mainAccounts: Map<string, Account[] | null> = new Map();
  private childrenAccounts: Map<number, AccountRelationship[] | null> = new Map();

  get lockFinancialState(){
    const lastStatus = getLastFinancialStateStatus(null,false,null, this.statuses);
    switch (lastStatus?.status.name) {
      case FinancialStateStatusEnum.APPROVED:
      case FinancialStateStatusEnum.REJECTED:
      case FinancialStateStatusEnum.LOCKED:
      case FinancialStateStatusEnum.SENT:
        return true;

      default:
        return false;
    }
  }

  constructor() {
    liveQuery(() => db.accountErrorsFinancialStateForm.toArray()).subscribe(accountErrors =>{
      this.accountErrors = accountErrors.map(error=>error.accountError);
    });
  }

  async addAccountWithError(value: FinancialStateAccountValue, valueError: string){
    db.accountErrorsFinancialStateForm.add({id:value.accountValue.id!, accountError:{accountValue: value,valueError, checkDate: new Date()}});
  }

  async removeAccountWithError(accountValue: AccountValue){
    await db.accountErrorsFinancialStateForm.delete(accountValue.id!);
    this.enableApprove = this.accountErrors.length === 0;
  }

  async addPageMainAccounts(page: string, mainAccounts: Account[]){
    const result =db.mainAccountsFinancialStateForm.add({id:page,accounts:mainAccounts});
  }

  async addChildrenAccounts(accountId: number, rel: AccountRelationship[]){
    db.childrenAccountsFinancialStateForm.add({id:accountId, relationship:rel});
  }

  async getMainAccountsByPage(page: string): Promise<Account[] | null | undefined>{
    const result = await db.mainAccountsFinancialStateForm.get(page);    
    return result?.accounts;
  }

  async getChildrenByAccount(accountId: number): Promise<AccountRelationship[] | null | undefined>{
    const result = await db.childrenAccountsFinancialStateForm.get(accountId);
    return result?.relationship;
  }

  async clearMainAccountsByPage(){
    db.mainAccountsFinancialStateForm.clear();
  }

  async clearsChildrensByAccount(){
    db.childrenAccountsFinancialStateForm.clear();
  }

  async clearAccountError(){
    db.accountErrorsFinancialStateForm.clear();
  }
}
