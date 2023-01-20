import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, FinancialStateAccountValue } from "@models/account.model";
import { CellDef, RowInput, Styles } from "jspdf-autotable";
import { getAccountValue, getValue } from "../../util";

const OtherIncome = (otherIncomeChildren: Account[], values: FinancialStateAccountValue[]): RowInput[] => {
  const headerStyle: Partial<Styles> = {halign: 'center', valign: 'middle', fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], fontSize: 18};
  return [
    [
      {content: 'OTROS INGRESOS', colSpan: 4, styles: headerStyle},
    ],
    [
      {content: 'NOMBRE DE LA CUENTA', styles: headerStyle},
      {content: 'No.', styles: headerStyle},
      {content: 'MES', styles: headerStyle},
      {content: 'DEL AÑO A LA FECHA', styles: headerStyle},
    ],
    ...otherIncomeChildren.map((account): CellDef[] =>
      [
        {content: account.name || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center'}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.MONTH))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.FROM_YEAR_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
      ])
  ];
}

export default OtherIncome;
