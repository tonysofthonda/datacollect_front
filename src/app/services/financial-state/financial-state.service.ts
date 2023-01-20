import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountError, FinancialStateAccountValue } from '@models/account.model';
import { Paginated } from '@models/common.model';
import { FinancialState } from '@models/financial-state.model';
import { PaginatedResponse } from '@models/response.model';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialStateService {

  constructor(private http: HttpClient) { }

  getFinancialStates(
    page: number = 0,
    elementsByPage: number = 10,
    dealerGroupId: number | null = null,
    dealerId: number | null = null,
    year: number | null = null,
    month: number | null = null,
    statusId: number | null = null): Observable<Paginated<FinancialState>>{
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("elementsByPage",elementsByPage.toString());
      params.append("dealerGroupId",dealerGroupId?.toString() || '');
      params.append("dealerId",dealerId?.toString()  || '');
      params.append("year",year?.toString() || '');
      params.append("month",month?.toString() || '');
      params.append("statusId",statusId?.toString() || '');
      return this.http.get<PaginatedResponse<FinancialState>>(`${environment.backendUrl}/financial-state/list?${params.toString()}`)
      .pipe(map(({ content, totalPages, size, totalElements })=>({
        result: content,
        currentPage: page,
        totalPages,
        elementsByPage: size,
        totalElements,
      })));
  }

  getFinancialState(id: number): Observable<FinancialState>{
    return this.http.get<FinancialState>(`${environment.backendUrl}/financial-state/${id}`);
  }

  getLasthMonthTotalUnitsPassives(id: number): Observable<FinancialStateAccountValue[]>{
    return this.http.get<FinancialStateAccountValue[]>(`${environment.backendUrl}/financial-state/last-month-total-units-passives/${id}`)
  }

  getHistoricalPage4(id: number): Observable<FinancialStateAccountValue[]>{
    return this.http.get<FinancialStateAccountValue[]>(`${environment.backendUrl}/financial-state/historical-page-4/${id}`)
  }

  getHistoricalPage2and3(id: number): Observable<FinancialStateAccountValue[]>{
    return this.http.get<FinancialStateAccountValue[]>(`${environment.backendUrl}/financial-state/historical-page-2-3/${id}`)
  }

  getLastErrorsOfEvaluation(id: number): Observable<AccountError[]>{
    return this.http.get<AccountError[]>(`${environment.backendUrl}/financial-state/last-errors-of-evaluation/${id}`)
  }

  saveFinancialStateValues(values: FinancialStateAccountValue[], financialStateId: number): Observable<FinancialState>{
    return this.http.post<any>(`${environment.backendUrl}/financial-state/values/save/${financialStateId}`,values.map(value=>({value:value.value, accountValue: {id: value.accountValue.id}, financialState: {id: value.financialState.id}}))).pipe(map(({financialState})=>financialState));
  }

  sendFinancialState(values: FinancialStateAccountValue[], financialStateId: number): Observable<FinancialState>{
    return this.http.post<any>(`${environment.backendUrl}/financial-state/send/${financialStateId}`,values.map(value=>({value:value.value, accountValue: {id: value.accountValue.id}, financialState: {id: value.financialState.id}}))).pipe(map(({financialState})=>financialState));
  }

  approveFinancialState(financialStateId: number){
    return this.http.post(`${environment.backendUrl}/financial-state/approve/${financialStateId}`,{});
  }

  rejectFinancialState(financialStateId: number, comments: string, errors: AccountError[], newLimitDate: string){
    return this.http.post(`${environment.backendUrl}/financial-state/reject/${financialStateId}`,{comments,errors,newLimitDate});
  }

  observationsFinancialState(financialStateId: number, comments: string){
    return this.http.post(`${environment.backendUrl}/financial-state/observations/${financialStateId}`,{comments});
  }

  updateFinancialStatesLimitDate(financialStates: FinancialState[], newLimitDate: Date){
    return this.http.post(`${environment.backendUrl}/financial-state/update-financial-states-limit-dates`,{financialStates, newLimitDate});
  }

  restartProgressStatus(id: number) {
    return this.http.put(`${environment.backendUrl}/financial-state/${id}`, null);
  }

  uploadFile(formData: any) {
    return this.http.post(`${environment.backendUrl}/financial-state/upload/`, formData);
  }
}
