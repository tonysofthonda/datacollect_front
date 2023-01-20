import { Component, OnInit } from '@angular/core';
import { Paginated } from '@models/common.model';
import { castToOperationCodeTable, OperationCode, OperationCodeTable } from '@models/operation-code.model';
import { OperationCodeService } from '@services/operation-code/operation-code.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-operation-code',
  templateUrl: './operation-code.component.html',
  providers: [ConfirmationService],
})
export class OperationCodeComponent implements OnInit {
  term: string = '';
  loading: boolean = true;
  paginatedOperationCode: Paginated<OperationCodeTable> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };

  constructor(
    private operationCodeService: OperationCodeService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  public setTerm(term: string) {
    this.term = term;
    this.getOperationCode();
  }

  public loadOperationCode(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;

    this.getOperationCode(
      currentPage,
      event.rows,
      event.sortField,
      event.sortOrder
    );
  }

  private getOperationCode(
    page: number = 0,
    elementsByPage: number = 10,
    sortField: string | undefined = undefined,
    sortOrder: number | undefined = undefined
  ) {
    this.loading = true;

    const error = () => {
      this.loading = false;
      return of();
    };

    const success = (operationCode: Paginated<OperationCode>) => {
      this.paginatedOperationCode = {
        ...operationCode,
        result: operationCode.result.map(castToOperationCodeTable)
      };
      if (sortField && sortOrder) {
        this.paginatedOperationCode.result = sortDataTable(
          this.paginatedOperationCode.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.operationCodeService
        .filterOperationCode(this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.operationCodeService
        .getOperationCode(page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
