import { AccountComponentEnum } from "@enums/account-component.enum";
import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, FinancialStateAccountValue } from "@models/account.model";
import { CellDef, RowInput } from "jspdf-autotable";
import { getAccountValue, getValue } from "../../util";

const TotalFixedActives = (activesChildren: Account[], values: FinancialStateAccountValue[]): RowInput[] => {
  const totalFixedActives = activesChildren.filter(account => account.component?.name === AccountComponentEnum.TOTAL_FIXED_ASSETS);

  return [
    [
      {content: 'NOMBRE DE LA CUENTA', styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: 'No. DE LA CUENTA', styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: 'COSTO', styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: 'DEPRECIACION ACUMULADA', colSpan:3, styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: '', styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0]}},
    ],
    ...totalFixedActives.map((account): CellDef[] => [
      {content: account.name || '', styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: account.accountNumber || '', styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.COST))?.value || '0', styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.ACCUMULATED_DEPRECIATION))?.value || '', colSpan:3, styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.AMOUNT))?.value || '0', styles: {halign: 'center', lineWidth: 0.3, lineColor: [0, 0, 0]}},
    ])
  ];
};

export default TotalFixedActives;
