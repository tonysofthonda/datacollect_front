import { Account, AccountError, AccountRelationship } from "@models/account.model";
import Dexie, { Table } from "dexie";

export interface AccountErrorDb{
  id: number;
  accountError: AccountError;
}

export interface AccountDb{
  id: string;
  accounts: Account[];
}

export interface AccountRelationshipDb{
  id: number;
  relationship: AccountRelationship[];
}


class AppDB extends Dexie {
  accountErrorsFinancialStateForm!: Table<AccountErrorDb, number>;
  mainAccountsFinancialStateForm!: Table<AccountDb, string>;
  childrenAccountsFinancialStateForm!: Table<AccountRelationshipDb, number>;

  constructor() {
    super('datacollect-indexeddb');
    this.version(3).stores({
      accountErrorsFinancialStateForm: '++id',
      mainAccountsFinancialStateForm: '++id',
      childrenAccountsFinancialStateForm: '++id'
    });
  }
}

export const db = new AppDB
