import { Component, OnInit } from '@angular/core';
import { Paginated } from '@models/common.model';
import { OrderType } from '@models/order-type.model';
import { OrdersTypesService } from '@services/orders-types/orders-types.service';
import { LazyLoadEvent } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-orders-types-list',
  templateUrl: './orders-types-list.component.html',
})
export class OrdersTypesListComponent implements OnInit {
  private term: string = '';

  public paginatedOrderTypes: Paginated<OrderType> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  public loading: boolean = true;

  constructor(private ordersTypesService: OrdersTypesService) {}

  ngOnInit(): void {}

  public setTerm(term: string) {
    this.term = term;
    this.getOrdersTypes();
  }

  public loadOrdersTypes(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getOrdersTypes(
      currentPage,
      event.rows,
      event.sortField,
      event.sortOrder
    );
  }

  private getOrdersTypes(
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

    const success = (paginatedGroups: Paginated<OrderType>) => {
      this.paginatedOrderTypes = paginatedGroups;
      if (sortField && sortOrder) {
        this.paginatedOrderTypes.result = sortDataTable(
          this.paginatedOrderTypes.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.ordersTypesService
        .filterOrderType(this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.ordersTypesService
        .getOrdersTypes(page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
