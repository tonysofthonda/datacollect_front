import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, FinancialStateAccountValue } from "@models/account.model";
import { CellDef, RowInput, Styles } from "jspdf-autotable";
import { getAccountValue, getValue } from "../../util";

const GrossProfitAnalysis = (grossProfitAnalysis: Account[], values: FinancialStateAccountValue[]): RowInput[] => {
  const headerStyle: Partial<Styles> = {halign: 'center', valign: 'middle', fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], fontSize: 18};

  const modelsAccounts = grossProfitAnalysis.filter(account => account.model);
  const accountsWithoutModels = grossProfitAnalysis.filter(account => !account.model && account.name !== "Tabla utilidad bruta");
  return [
    [
      {content: 'MES ACTUAL', colSpan: 4, styles: headerStyle},
      {content: 'ANALISIS DE UTILIDAD BRUTA', colSpan: 2, styles: {halign: 'center', valign: 'middle',fillColor: [255, 255, 255], fontStyle: 'bold', fontSize: 18}},
      {content: 'DEL AÑO A LA FECHA', colSpan: 4, styles: headerStyle},
    ],
    [
      {content: 'Unidades', styles: headerStyle},
      {content: 'Ventas', styles: headerStyle},
      {content: 'Utilidad bruta', styles: headerStyle},
      {content: '% uni vendidas.', styles: headerStyle},

      {content: 'A.- DEPARTAMENTO DE VEHICULOS NUEVO', styles: headerStyle},
      {content: 'No: cta', styles: headerStyle},

      {content: 'Unidades', styles: headerStyle},
      {content: 'Ventas', styles: headerStyle},
      {content: 'Utilidad bruta', styles: headerStyle},
      {content: '% uni vendidas.', styles: headerStyle},
    ],
    ...modelsAccounts.map((account): CellDef[] =>
      [
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.UNITS, TypeAccountValueEnum.CURRENT_MONTH))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.SALES, TypeAccountValueEnum.CURRENT_MONTH))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.GROSS_PROFIT, TypeAccountValueEnum.CURRENT_MONTH))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.PERCENTAGE_SOLD_UNITS, TypeAccountValueEnum.CURRENT_MONTH))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},

        {content: (account.model?.name || '') + ' - ' + (account.model?.year || ''), styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: account.accountNumber || '', styles: {valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center'}},

        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.UNITS, TypeAccountValueEnum.FROM_YEAR_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.SALES, TypeAccountValueEnum.FROM_YEAR_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.GROSS_PROFIT, TypeAccountValueEnum.FROM_YEAR_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.PERCENTAGE_SOLD_UNITS, TypeAccountValueEnum.FROM_YEAR_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
      ]),
      ...accountsWithoutModels.map((account): CellDef[] =>
      [
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.UNITS, TypeAccountValueEnum.CURRENT_MONTH))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.SALES, TypeAccountValueEnum.CURRENT_MONTH))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.GROSS_PROFIT, TypeAccountValueEnum.CURRENT_MONTH))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.PERCENTAGE_SOLD_UNITS, TypeAccountValueEnum.CURRENT_MONTH))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},

        {content: account.name || '', styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], fontStyle: account.relationshipCheck.hasChildren ? "bold" : "normal"}},
        {content: account.accountNumber || '', styles: {valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center'}},

        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.UNITS, TypeAccountValueEnum.FROM_YEAR_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.SALES, TypeAccountValueEnum.FROM_YEAR_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.GROSS_PROFIT, TypeAccountValueEnum.FROM_YEAR_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.PERCENTAGE_SOLD_UNITS, TypeAccountValueEnum.FROM_YEAR_TO_DATE))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
      ]),
  ];
};

export default GrossProfitAnalysis;

