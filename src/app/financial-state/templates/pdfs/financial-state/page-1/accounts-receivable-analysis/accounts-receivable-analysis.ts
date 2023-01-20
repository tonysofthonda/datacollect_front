import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, FinancialStateAccountValue } from "@models/account.model";
import { CellDef, RowInput } from "jspdf-autotable";
import { getAccountValue, getValue } from "../../util";

const AccountsReceivableAnalysis = (accountsReceivableAnalysisChildren: Account[], values: FinancialStateAccountValue[]): RowInput[]=>{


  return [
    [{content:'Analisis de cuentas por cobrar',colSpan: 7, styles: {halign: 'center', valign: 'middle',fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], fontSize: 18}}],
    [
      {content: 'TIPO',colSpan: 1, rowSpan: 2, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: 'NO. CUENTA',colSpan: 1, rowSpan: 2, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: 'TOTAL AL CORRIENTE',colSpan: 1, rowSpan: 2, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: 'ANALISIS DE CUENTAS VENCIDAS',colSpan: 3, rowSpan: 1, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: 'CUENTAS DUDOSAS',colSpan: 1, rowSpan: 2, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
    ],
    [
      {content: '31-60',colSpan: 1, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: '61-90',colSpan: 1, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: 'SOBRE 90',colSpan: 1, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
    ],
    ...accountsReceivableAnalysisChildren.map((account): CellDef[] =>
    [
      {content: account.name || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center'}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.TOTAL_UP_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.ANALYSIS_OVERDUE_ACCOUNTS))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.T31_60))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.T61_90))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.TOVER_90))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.DOUBTFUL_ACCOUNTS))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}}
    ])
  ];
}

export default AccountsReceivableAnalysis;
