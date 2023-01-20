import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FinancialStateStatusEnum } from '@enums/financial-state-status.enum';
import { FinancialState } from '@models/financial-state.model';
import { AccountService } from '@services/accounts/account.service';
import { FinancialStateService } from '@services/financial-state/financial-state.service';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { getLastFinancialStateStatus } from 'src/app/helpers/util';

@Injectable({
  providedIn: 'root'
})
export class FinancialStateFormResolverService implements Resolve<any>{

  isEvaluating(financialState: FinancialState){
    const name = getLastFinancialStateStatus(financialState, true)?.status.name;
    return name === FinancialStateStatusEnum.APPROVED || name === FinancialStateStatusEnum.REJECTED || name === FinancialStateStatusEnum.SENT || name === FinancialStateStatusEnum.COMMENTED;
  }

  isEditing(financialState: FinancialState){
    const name = getLastFinancialStateStatus(financialState, true)?.status.name;
    return name === FinancialStateStatusEnum.STATELESS || name === FinancialStateStatusEnum.IN_PROGRESS;
  }

  constructor(
    private financialStateService: FinancialStateService,
    private accountService: AccountService,
    private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const id = parseInt(route.paramMap.get("id")!);
      return forkJoin({
        financialState: this.financialStateService.getFinancialState(id),
        pages: this.accountService.getAllPages()
      }).pipe(switchMap(({financialState, pages})=>{
        const isEditing = this.isEditing(financialState);
        const isEvaluating = this.isEvaluating(financialState);
        return forkJoin({
          financialState: of(financialState),
          pages: of(pages),
          totalFields: isEditing ? this.accountService.getAllAccountValueSize() : of(0),
          totalUnitsPasives: isEditing ? this.financialStateService.getLasthMonthTotalUnitsPassives(financialState.id!) : of([]),
          historicalPage4: isEditing ? this.financialStateService.getHistoricalPage4(financialState.id!) : of([]),
          historicalPage2and3: isEditing ? this.financialStateService.getHistoricalPage2and3(financialState.id!) : of([]),
          accountErrors: isEvaluating ? this.financialStateService.getLastErrorsOfEvaluation(financialState.id!) : of([])
        });
      }),catchError(()=>{
        this.location.back();
        return of();
      }));
  }
}
