import { AccountComponentEnum } from "@enums/account-component.enum";
import { Observable } from "rxjs";
import { FinancialState, FinancialStateStatus } from "./financial-state.model";
import { Model } from "./model.model";

export interface Account{
  id?: number;
  name?: string;
  accountNumber?: string;
  page?: string;
  formula: boolean;
  parent: AccountRelationship;
  children: AccountRelationship[];
  accountValues?: AccountValue[];
  relationshipCheck: RelationshipCheck;
  component?: AccountComponent;
  model?: Model;
}


interface RelationshipCheck{
  hasParent: boolean;
  hasChildren: boolean;
}

export interface AccountRelationship{
  parent: Account;
  child: Account;
  order: number;
}

export interface TypeAccountValue{
  id?: number;
  name: string;
  relationshipCheck: RelationshipCheck;
  parent: TypeAccountValueRelationship;
  children: TypeAccountValueRelationship[];
}

export interface TypeAccountValueRelationship {
  parent: TypeAccountValue;
  child: TypeAccountValue;
  order: number;
}

export interface AccountValue{
  id?: number;
  account: Account;
  typeValue: TypeAccountValue;
  formula?: Formula;
  readOnly: boolean;
  required: boolean;
  defaultValue: string;
}

export interface Formula{
  id?: number;
  ownerAccount: AccountValue;
  formula: string;
  terms: FormulaTerms[];
}

export interface FormulaTerms{
  formula?: Formula;
  accountTerm: AccountValue;
  order: number;
}

export interface FinancialStateAccountValue{
  id?: number;
  value: string;
  financialState: FinancialState;
  accountValue: AccountValue;
  errors?: AccountError[];
}

export interface AccountError{
  id?: number;
  checkDate?: Date;
  valueError: string;
  accountValue: FinancialStateAccountValue;
  status?: FinancialStateStatus;
}

export interface AccountComponent{
  id?: number;
  name: AccountComponentEnum;
}

export interface PendingAccountChildren{
  [key: number]: Observable<AccountRelationship[]>;
}

export interface ResponseChildrenAccounts{
  accountsRels: AccountRelationship[];
  [key: number]: AccountRelationship[];
}

export interface PendingTypeAccountValueChildren{
  [key: number]: Observable<TypeAccountValueRelationship[]>;
}

export interface ResponseChildrenTypeAccountValue{
  accountsRels: TypeAccountValueRelationship[];
  [key: number]: TypeAccountValueRelationship[];
}

export interface ResponseChildrenMainTypeAccountValue{
  accountsRels: TypeAccountValue[];
  [key: number]: TypeAccountValueRelationship[];
}

