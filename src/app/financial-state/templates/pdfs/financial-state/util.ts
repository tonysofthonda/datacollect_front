import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, AccountValue, FinancialStateAccountValue } from "@models/account.model";

export const getAccountValue = (account: Account, typeValueName: TypeAccountValueEnum, parentTypeValueName: TypeAccountValueEnum | null = null): AccountValue | undefined => {
  return account.accountValues?.find(acValue => {
    if(parentTypeValueName){
      return acValue.typeValue.parent.parent.name === parentTypeValueName &&
              acValue.typeValue.name === typeValueName;
    }else{
        return acValue.typeValue.name === typeValueName;
    }
  });
}

export const getValue = (values: FinancialStateAccountValue[], accountValue: AccountValue | undefined): FinancialStateAccountValue | undefined => {
  return values.find(value => accountValue?.id === value.accountValue.id);
}
