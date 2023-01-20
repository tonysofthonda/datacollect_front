import { FinancialStateStatusEnum } from "@enums/financial-state-status.enum";
import { Account, AccountValue, TypeAccountValue } from "@models/account.model";
import { FinancialState, FinancialStateStatus } from "@models/financial-state.model";

export const sortDataTable = (
  datasource: any[],
  sortField: string,
  sortOrder: number
) => {
  return datasource.sort((data1, data2) => {
    let value1 = data1[sortField];
    let value2 = data2[sortField];
    let result = null;
    if (value1 == null && value2 != null) result = -1;
    else if (value1 != null && value2 == null) result = 1;
    else if (value1 == null && value2 == null) result = 0;
    else if (typeof value1 === 'string' && typeof value2 === 'string')
      result = value1.localeCompare(value2);
    else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
    return sortOrder * result;
  });
};

export const getMonthTextByNumber = (monthNumber: number, locale: string = "en-us") => {
  const date = new Date(`2022/${monthNumber}/01`);
  return date.toLocaleString(locale, {month: 'long'});
}

export const getDateAsText = (date: Date, sumDay: boolean = true) => {
  const dayMonth = sumDay ? date.getDate() + 1 : date.getDate();
  const month = toTitleCase(getMonthTextByNumber(date.getMonth() + 1, "es-mx"));
  const year = date.getFullYear();
  return `${dayMonth} de ${month} del ${year}`
}

export const getLastFinancialStateStatus = (financialState: FinancialState | null, considerCommented: boolean = false, lastStatus: FinancialStateStatusEnum | null = null, statuses: FinancialStateStatus[] = []): FinancialStateStatus | null => {
  let statusesFiltered = (financialState?.statuses || statuses).filter(status=> considerCommented || (!considerCommented && status.status.name !== FinancialStateStatusEnum.COMMENTED)).filter(status => !lastStatus || (lastStatus && status.status.name === lastStatus));
  
  if(statusesFiltered.length === 0){
    return null;
  }
  return statusesFiltered.reduce((status1,status2)=>(status1.dateAssignment > status2.dateAssignment) ? status1: status2);
}

export const getStatusesFromLastSent = (financialState: FinancialState)=>{
  const lastSentStatus = getLastFinancialStateStatus(financialState, false, FinancialStateStatusEnum.SENT);
  return financialState.statuses.filter(status => status.dateAssignment >= (lastSentStatus?.dateAssignment || new Date()))
}


export const flatAccountRelationship = (parentAccount: Account, reverse: boolean = true): Account[] => {
  const children = parentAccount.children.map(({child})=>{
    let extraChildren: Account[] = [];
    if(child.relationshipCheck.hasChildren){
      extraChildren = flatAccountRelationship(child);
    }
    return reverse ? [...extraChildren,child] : [child, ...extraChildren];
  }).flat(1);
  return reverse ? [...children,parentAccount].filter((account, index, self)=>index === self.findIndex(account2=>account.id === account2.id)) : [parentAccount, ...children].filter((account, index, self)=>index === self.findIndex(account2=>account.id === account2.id));
};

export const extractTypeAccountValuesOfRelationship = (parentAccount: Account): TypeAccountValue[] =>{
  const parentTypeValues = extractTypeAccountValues(parentAccount);
  const childrenTypeValues = parentAccount.children.map(({child})=>{
    let extraTypeValues: TypeAccountValue[] = [];
    if(child.relationshipCheck.hasChildren){
      extraTypeValues = extractTypeAccountValuesOfRelationship(child);
    }
    return [...extractTypeAccountValues(child),...extraTypeValues];
  }).flat(1);
  const typeValues = [...parentTypeValues,...childrenTypeValues];
  return typeValues.filter((typeValue, index, self)=>index === self.findIndex(typeValue2=>typeValue.id === typeValue2.id));
}

export const extractTypeAccountValues = (account: Account): TypeAccountValue[] => {
  return account.accountValues?.map(accountValue => accountValue.typeValue) || [];
}

export const extractFormulaDesc = ({formula}: AccountValue): string => {
  let desc = "";
  if(formula){
    let formulaText = formula.formula;
    for(const {accountTerm:{typeValue,account}} of formula.terms){
      formulaText = formulaText.replace('?',` ${typeValue.name} de ${account?.name || (account?.model && 'Modelo ' + account.model?.name) || 'campo desconocido'} `);
    }
    desc = `Formula: ${formulaText}`
  }  
  return desc;
}

export const getAccountValueByTypeAccount = (account: Account, typeValue: TypeAccountValue) =>{
 return account.accountValues?.find(accountValue=>accountValue.typeValue.id === typeValue.id)
}

export const extractMainTypeAccountValues = (typeAccountValues: TypeAccountValue[]): TypeAccountValue[]=>{
  let mainTypeAccountValues: TypeAccountValue[] = [];

  for (const typeAccountValue of typeAccountValues) {
    const parentRel = typeAccountValue.parent;

    if(parentRel && !mainTypeAccountValues.some(typeAccountValue => typeAccountValue.id === parentRel.parent.id)){
      const parent: TypeAccountValue = {
        ...parentRel.parent,
        children: typeAccountValues.filter(typeAccountValue=>typeAccountValue.parent?.parent.id == parentRel.parent.id).map(typeAccountValue=>({parent: parentRel.parent, child: typeAccountValue, order: typeAccountValue.parent.order}))
      }
      mainTypeAccountValues.push(parent);
    }else if(!parentRel) {
      mainTypeAccountValues.push(typeAccountValue);
    }
  }

  return mainTypeAccountValues;
}

export const setAccountToAccountValue = (account:Account): AccountValue[] =>{
  const accountModified:Account = {...account, accountValues:undefined};
  return account.accountValues?.map(acValue=>({...acValue,account: accountModified})) || [];
}

export const toTitleCase = (text: string) => {
  return text.replace(/\w\S*/g,(txt)=>txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
