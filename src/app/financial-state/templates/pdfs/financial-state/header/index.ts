import { FinancialState } from "@models/financial-state.model";
import jsPDF from "jspdf";
import autoTable, { Styles } from 'jspdf-autotable';
import { getDateAsText, getLastFinancialStateStatus } from "src/app/helpers/util";

const Header = (doc: jsPDF, financialState: FinancialState)=>{

  const {getWidth} = doc.internal.pageSize;

  const logo = new Image();
  logo.src = 'assets/images/honda-logo.png'
  doc.addImage(logo, 'png', 10, 10, 84, 37);

  doc
    .setFontSize(14)
    .setFont('Arial','bold')
    .text('         CONFIDENCIAL\nESTADO FINANCIERO DEL CONCESIONARIO',(getWidth()/2) - 10 ,17,{charSpace: 2, align: 'center'});

  autoTable(doc, {
    body: [[{content: 'Formato 2022', styles: {halign: 'center', valign: 'middle',fontSize: 14,cellWidth: 50, minCellHeight: 5, fillColor: [255, 102, 153], textColor: [255, 255, 255]}}]],
    startY: 10,
    margin: {left: 790, right: 0},
  })

  doc.setLineWidth(4);
  doc.setFillColor(0, 0, 255);
  doc.rect((getWidth()/2) - 10, 25,50,10,'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('BALANCE GENERAL',(getWidth()/2) - 5.5, 31);

  doc.setFontSize(9);
  doc.setTextColor(0,0,0);
  doc.setFont('times','bold');

  doc.setFontSize(14);
  doc.text('DIVISIÓN AUTOMOVILES', 15, 45);
  doc.setFontSize(9);

  doc.setFont('Arial', 'normal');


  const placeholderStyle: Partial<Styles> = {fontSize:12,halign: 'right', fillColor: [255,255,255]};
  const valueStyle: Partial<Styles> = {fontSize:12,halign: 'left', fillColor: [227,227,227]};

  autoTable(doc, {
    body: [
      [{content:'CONCESIONARIA No.:', styles: placeholderStyle}, {content: financialState.dealer.dealerNumber, styles: valueStyle},
       {content: 'ESTATUS:', styles: placeholderStyle }, {content: getLastFinancialStateStatus(financialState)?.status.name, styles: valueStyle}],
      [{content:'CONCESIONARIA:', styles: placeholderStyle}, {content: financialState.dealer.name, styles: valueStyle},
       {content: 'ELABORO:', styles: placeholderStyle }, {content: '', styles: valueStyle}],
      [{content:'ESTADO:', styles: placeholderStyle}, {content: financialState.dealer.city.state.name, styles: valueStyle},
       {content: 'CP:', styles: placeholderStyle }, {content: financialState.dealer.postcode || '', styles: valueStyle}],
      [{content:'CIUDAD:', styles: placeholderStyle}, {content: financialState.dealer.city.name, styles: valueStyle},
       {content: '', styles: placeholderStyle }, {content:'', styles: placeholderStyle}],
      [{content:'PERIODO DE COBERTURA DESDE:', styles: placeholderStyle}, {content: getDateAsText(new Date(`${financialState.year}-${financialState.month}-01`), false), styles: valueStyle},
       {content: 'HASTA:', styles: placeholderStyle }, {content: getDateAsText(new Date(financialState.limitDate)), styles: valueStyle}]
    ],
    margin: {left: 0, right: 190},
    startY: 50
  });
}

export default Header;
