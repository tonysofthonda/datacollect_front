import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, FinancialStateAccountValue } from "@models/account.model";
import { CellDef, RowInput, Styles } from "jspdf-autotable";
import { getAccountValue, getValue } from "../../util";


const IncomeExpCoccesionaire = (accountsIncomeExpCoccesionaireChildren: Account[], values: FinancialStateAccountValue[]): RowInput[] => {
  const headerStyle: Partial<Styles> = {halign: 'center', valign: 'middle', fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], fontSize: 18};
  return [
    [
      {content: 'NOMBRE DE LA CUENTA',colSpan: 1, rowSpan: 2, styles: headerStyle},
      {content: 'NO. CUENTA',colSpan: 1, rowSpan: 2, styles: headerStyle},
      {content: 'TOTAL DE INGRESOS Y EGRESOS DE LA CONCESIONARIA',colSpan: 3, rowSpan: 1, styles: headerStyle},
      {content: 'A Depto Honda Nuevos',colSpan: 2, rowSpan: 1, styles: headerStyle},
      {content: 'B Otros Vehiculos Nuevos',colSpan: 2, rowSpan: 1, styles: headerStyle},
      {content: 'C DEPT VEHICULOS USADOS',colSpan: 2, rowSpan: 1, styles: headerStyle},
      {content: 'D DEPT SERVICIO',colSpan: 2, rowSpan: 1, styles: headerStyle},
      {content: 'E DEPT TALLER DE CARROCERIA',colSpan: 2, rowSpan: 1, styles: headerStyle},
      {content: 'F DEPT REFACCIONES Y ACCESORIOS',colSpan: 2, rowSpan: 1, styles: headerStyle},
    ],
    [
      {content: 'MES',colSpan: 1, rowSpan: 1, styles: headerStyle},
      {content: 'DEL AÑO A LA FECHA',colSpan: 1, rowSpan: 1, styles: headerStyle},
      {content: 'GANANCIAS BRUTAS VENTAS %',colSpan: 1, rowSpan: 1, styles: headerStyle},

      {content: 'MES',colSpan: 1, rowSpan: 1, styles: headerStyle},
      {content: 'DEL AÑO A LA FECHA',colSpan: 1, rowSpan: 1, styles: headerStyle},

      {content: 'MES',colSpan: 1, rowSpan: 1, styles: headerStyle},
      {content: 'DEL AÑO A LA FECHA',colSpan: 1, rowSpan: 1, styles: headerStyle},

      {content: 'MES',colSpan: 1, rowSpan: 1, styles: headerStyle},
      {content: 'DEL AÑO A LA FECHA',colSpan: 1, rowSpan: 1, styles: headerStyle},

      {content: 'MES',colSpan: 1, rowSpan: 1, styles: headerStyle},
      {content: 'DEL AÑO A LA FECHA',colSpan: 1, rowSpan: 1, styles: headerStyle},

      {content: 'MES',colSpan: 1, rowSpan: 1, styles: headerStyle},
      {content: 'DEL AÑO A LA FECHA',colSpan: 1, rowSpan: 1, styles: headerStyle},

      {content: 'MES',colSpan: 1, rowSpan: 1, styles: headerStyle},
      {content: 'DEL AÑO A LA FECHA',colSpan: 1, rowSpan: 1, styles: headerStyle},
    ],
    ...accountsIncomeExpCoccesionaireChildren.map((account): CellDef[] =>
      [
        {content: account.name || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], fontStyle: account.relationshipCheck.hasChildren ? "bold" : "normal"}},
        {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center'}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.TOTAL_INC_EXP))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.FROM_YEAR_TO_DATE, TypeAccountValueEnum.TOTAL_INC_EXP))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.GROSS_PROFIT_SALES, TypeAccountValueEnum.TOTAL_INC_EXP))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},

        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.A_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.FROM_YEAR_TO_DATE, TypeAccountValueEnum.A_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},

        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.B_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.FROM_YEAR_TO_DATE, TypeAccountValueEnum.B_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},

        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.C_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.FROM_YEAR_TO_DATE, TypeAccountValueEnum.C_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},

        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.D_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.FROM_YEAR_TO_DATE, TypeAccountValueEnum.D_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},

        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.E_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.FROM_YEAR_TO_DATE, TypeAccountValueEnum.E_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},

        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.F_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.FROM_YEAR_TO_DATE, TypeAccountValueEnum.F_DEPT))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
      ])
  ];
}

export default IncomeExpCoccesionaire;
