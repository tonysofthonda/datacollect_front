import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account, AccountRelationship, Formula, PendingAccountChildren, ResponseChildrenAccounts } from '@models/account.model';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {
  }

  getMainAccounts(page: string): Observable<Account[]>{
    return this.http.get<Account[]>(`${environment.backendUrl}/account/main/${page}`);
  }

  getChildrenAccounts(parentId: number): Observable<AccountRelationship[]>{
    return this.http.get<AccountRelationship[]>(`${environment.backendUrl}/account/children/${parentId}`)
    .pipe(switchMap(this.getExtraChildren.bind(this)),map(this.joinExtraChildren.bind(this)));
  }

  private getExtraChildren(accountsRels: AccountRelationship[]){
    let pendingChildren: PendingAccountChildren = {};
    const children = accountsRels.map(accountRel=>accountRel.child);
    for(const child of children){
      if(child.relationshipCheck.hasChildren){
        pendingChildren = {
        ...pendingChildren,
        [child.id!]: this.getChildrenAccounts(child.id!)
        }
      }
    }
    return forkJoin({
      accountsRels: of(accountsRels),
      ...pendingChildren
    });
  }

  private joinExtraChildren({accountsRels,...data}:ResponseChildrenAccounts){
    const newAccountRels = accountsRels.map(accountRel=>{
      const children = data[accountRel.child.id!];
      if(children){
        accountRel.child.children = children;
      }
      return accountRel;
    });
    return newAccountRels;
  }

  getParentAccount(childId: number): Observable<AccountRelationship>{
    return this.http.get<AccountRelationship>(`${environment.backendUrl}/account/parent/${childId}`);
  }

  getAllPages(): Observable<string[]>{
    return this.http.get<string[]>(`${environment.backendUrl}/account/pages`);
  }

  getFormulaAccount(accountValueId: number): Observable<Formula[]>{
    return this.http.get<Formula[]>(`${environment.backendUrl}/account/formula/${accountValueId}`);
  }

  getAllAccountValueSize(){
    return this.http.get<number>(`${environment.backendUrl}/account/values/size`);
  }
}
