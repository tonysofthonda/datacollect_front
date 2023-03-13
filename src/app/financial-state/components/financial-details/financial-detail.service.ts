import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FinancialActive } from '../../models/active.model';
import { AnalisysFinancial } from '../../models/analisys.model';
import { FinancialStateInfo } from '../../models/financial-state.model';
import { NameAccountFinancial } from '../../models/nameaccount.model';
import { Page2And3IncomeDeductionFinancial } from '../../models/page2and3-incomededuction.moddel';
import { Page2And3OtherIncomeFinancial } from '../../models/page2and3-otherincome.model';
import { Page2And3PositionFinancial } from '../../models/page2and3-position.model';
import { Page2And3Financial } from '../../models/page2and3.model';
import { Page4Financial } from '../../models/page4.model';
import { FinancialPassive } from '../../models/passive.model';
import { PerMonthFinancial } from '../../models/permonth.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialActiveService {

  constructor(private http: HttpClient) {  }

  get(financialId: number){
    return this.http.get<FinancialActive[]>(`${environment.backendUrl}/financial-state/active/?financialId=${financialId}`).pipe();
  }

  getPassive(financialId: number){
    return this.http.get<FinancialPassive[]>(`${environment.backendUrl}/financial-state/passive/?financialId=${financialId}`).pipe();
  }

  getFinancialAnalisys(financialId: number){
    return this.http.get<AnalisysFinancial[]>(`${environment.backendUrl}/financial-state/analisys/?financialId=${financialId}`).pipe();
  }

  getFinancialNameAccount(financialId: number){
    return this.http.get<NameAccountFinancial[]>(`${environment.backendUrl}/financial-state/name/account/?financialId=${financialId}`).pipe();
  }

  getPerMonthFinancial(financialId: number){
    return this.http.get<PerMonthFinancial[]>(`${environment.backendUrl}/financial-state/per/month/?financialId=${financialId}`).pipe();
  }

  getIncomeAndExpesesPage3(financialId: number){
    return this.http.get<Page2And3Financial[]>(`${environment.backendUrl}/financial-state/income/expeses/page3?financialId=${financialId}`).pipe();
  }

  getPositionPage3(financialId: number){
    return this.http.get<Page2And3PositionFinancial[]>(`${environment.backendUrl}/financial-state/position/page3?financialId=${financialId}`).pipe();
  }

  getOtherIncomePage3(financialId: number){
    return this.http.get<Page2And3OtherIncomeFinancial[]>(`${environment.backendUrl}/financial-state/other/income/page3?financialId=${financialId}`).pipe();
  }

  getIncomeDeductionPage3(financialId: number){
    return this.http.get<Page2And3IncomeDeductionFinancial[]>(`${environment.backendUrl}/financial-state/income/deduction/page3?financialId=${financialId}`).pipe();
  }

  getIncomeAndExpensesPage4(financialId: number){
    return this.http.get<Page4Financial[]>(`${environment.backendUrl}/financial-state/income/expenses/page4?financialId=${financialId}`).pipe();
  }

  getInformation(financialId: number){
    return this.http.get<FinancialStateInfo>(`${environment.backendUrl}/financial-state/info?financialId=${financialId}`).pipe();
  }

  putActiveFinancial(financialActive: FinancialActive){
    return this.http.put<PerMonthFinancial[]>(`${environment.backendUrl}/financial-state/active`, financialActive).pipe();
  }

  putPassive(financialPassive: FinancialPassive){
    return this.http.put<FinancialPassive[]>(`${environment.backendUrl}/financial-state/passive/`, financialPassive).pipe();
  }

  putFinancialAnalisys(analisysFinancial: AnalisysFinancial){
    return this.http.put<AnalisysFinancial[]>(`${environment.backendUrl}/financial-state/analisys/`, analisysFinancial).pipe();
  }

  putFinancialNameAccount(nameAccountFinancial: NameAccountFinancial){
    return this.http.put<NameAccountFinancial[]>(`${environment.backendUrl}/financial-state/other/active`, nameAccountFinancial).pipe();
  }

  putPerMonthFinancial(perMonthFinancial: PerMonthFinancial){
    return this.http.put<PerMonthFinancial[]>(`${environment.backendUrl}/financial-state/other/passive/`, perMonthFinancial).pipe();
  }

  putIncomeAndExpesesPage3(page2And3Financial: Page2And3Financial){
    return this.http.put<Page2And3Financial[]>(`${environment.backendUrl}/financial-state/income/expeses/page3`, page2And3Financial).pipe();
  }

  putPositionPage3(page2And3PositionFinancial: Page2And3PositionFinancial){
    return this.http.put<Page2And3PositionFinancial[]>(`${environment.backendUrl}/financial-state/position/page3`, page2And3PositionFinancial).pipe();
  }

  putOtherIncomePage3(page2And3OtherIncomeFinancial: Page2And3OtherIncomeFinancial){
    return this.http.put<Page2And3OtherIncomeFinancial[]>(`${environment.backendUrl}/financial-state/other/income/page3`, page2And3OtherIncomeFinancial).pipe();
  }

  putIncomeDeductionPage3(page2And3IncomeDeductionFinancial: Page2And3IncomeDeductionFinancial){
    return this.http.put<Page2And3IncomeDeductionFinancial[]>(`${environment.backendUrl}/financial-state/income/deduction/page3/`, page2And3IncomeDeductionFinancial).pipe();
  }

  putIncomeAndExpensesPage4(page4Financial: Page4Financial){
    return this.http.put<Page4Financial[]>(`${environment.backendUrl}/financial-state/income/expenses/page4`, page4Financial).pipe();
  }
}
