import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PendingTypeAccountValueChildren, ResponseChildrenMainTypeAccountValue, ResponseChildrenTypeAccountValue, TypeAccountValue, TypeAccountValueRelationship } from '@models/account.model';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypesAccountsValuesService {

  constructor(private http: HttpClient) { }

  getMainTypesAccountsValues(): Observable<TypeAccountValue[]>{
    return this.http.get<TypeAccountValue[]>(`${environment.backendUrl}/type-account-value/main`)
    .pipe(
      switchMap(this.getExtraChildrenMain.bind(this)),
      map(this.joinExtraChildrenMain.bind(this))
    );
  }

  private getExtraChildrenMain(typesAccountsValues: TypeAccountValue[]){
    let pendingChildren: PendingTypeAccountValueChildren = {};
      for(const typeAccountValue of typesAccountsValues){
        if(typeAccountValue.relationshipCheck.hasChildren){
          pendingChildren = {
            ...pendingChildren,
            [typeAccountValue.id!]: this.getChildrenTypesAccountsValues(typeAccountValue.id!)
          }
        }
      }
      return forkJoin({
        accountsRels: of(typesAccountsValues),
        ...pendingChildren
      })
  }

  private joinExtraChildrenMain({accountsRels, ...data}: ResponseChildrenMainTypeAccountValue){
    return accountsRels.map((typeAccountValue)=>{
      const children = data[typeAccountValue.id!];
      if(children){
        typeAccountValue.children = children;
      }
      return typeAccountValue;
    });
  }

  getChildrenTypesAccountsValues(parentId: number): Observable<TypeAccountValueRelationship[]>{
    return this.http.get<TypeAccountValueRelationship[]>(`${environment.backendUrl}/type-account-value/children/${parentId}`)
    .pipe(switchMap(this.getExtraChildren.bind(this)),map(this.joinExtraChildren.bind(this)));
  }

  private getExtraChildren(accountsRels: TypeAccountValueRelationship[]){
    let pendingChildren: PendingTypeAccountValueChildren = {};
    const children = accountsRels.map(accountRel=>accountRel.child);
    for(const child of children){
      if(child.relationshipCheck.hasChildren){
        pendingChildren = {
        ...pendingChildren,
        [child.id!]: this.getChildrenTypesAccountsValues(child.id!)
        }
      }
    }
    return forkJoin({
      accountsRels: of(accountsRels),
      ...pendingChildren
    });
  }

  private joinExtraChildren({accountsRels,...data}:ResponseChildrenTypeAccountValue){
    const newAccountRels = accountsRels.map(accountRel=>{
      const children = data[accountRel.child.id!];
      if(children){
        accountRel.child.children = children;
      }
      return accountRel;
    });
    return newAccountRels;
  }
}
