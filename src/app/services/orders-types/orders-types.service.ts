import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '@models/common.model';
import { OrderType } from '@models/order-type.model';
import { PaginatedResponse } from '@models/response.model';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersTypesService {
  constructor(private http: HttpClient) {}

  public getOrdersTypes(
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<OrderType>> {
    return this.http
      .get<PaginatedResponse<OrderType>>(
        `${environment.backendUrl}/order-type/list?page=${page}&elementsByPage=${elementsByPage}`
      )
      .pipe(
        map(({ content, totalPages, size, totalElements }) => ({
          result: content,
          currentPage: page,
          totalPages,
          elementsByPage: size,
          totalElements,
        }))
      );
  }

  public filterOrderType(
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<OrderType>> {
    return this.http
      .get<PaginatedResponse<OrderType>>(
        `${environment.backendUrl}/order-type/filter/${term}?page=${page}&elementsByPage=${elementsByPage}`
      )
      .pipe(
        map(({ content, totalPages, size, totalElements }) => ({
          result: content,
          currentPage: page,
          totalPages,
          elementsByPage: size,
          totalElements,
        }))
      );
  }

  public getOrderType(id: number): Observable<OrderType> {
    return this.http.get<OrderType>(
      `${environment.backendUrl}/order-type/${id}`
    );
  }

  public getOrderTypeByCode(code: string): Observable<OrderType> {
    return this.http.get<OrderType>(
      `${environment.backendUrl}/order-type/code/${code}`
    );
  }

  public addOrderType(orderType: OrderType): Observable<OrderType> {
    return this.http.post<OrderType>(
      `${environment.backendUrl}/order-type/add`,
      orderType
    );
  }

  public editOrderType(
    orderType: OrderType,
    id: number
  ): Observable<OrderType> {
    return this.http.put<OrderType>(
      `${environment.backendUrl}/order-type/update/${id}`,
      orderType
    );
  }
}
