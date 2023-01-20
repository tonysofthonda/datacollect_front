import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FinancialStateStatus } from '@models/financial-state.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialStateStatusService {

  constructor(private http: HttpClient) { }

  getFinancialStateStatuses(): Observable<FinancialStateStatus[]>{
    return this.http.get<FinancialStateStatus[]>(`${environment.backendUrl}/financial-state-status/list`);
  }
}
