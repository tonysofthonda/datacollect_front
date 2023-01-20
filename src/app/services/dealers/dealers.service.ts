import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FetchType } from '@enums/fetch-type.enum';
import { Paginated } from '@models/common.model';
import { Dealer } from '@models/dealer.model';
import { PaginatedResponse } from '@models/response.model';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DealersService {
  constructor(private http: HttpClient) {}

  public getDealers(
    page: number = 0,
    elementsByPage: number = 10,
    fetchType: FetchType = FetchType.LAZY
  ): Observable<Paginated<Dealer> | Dealer[]> {
    return this.http
      .get<PaginatedResponse<Dealer> | Dealer[]>(
        `${environment.backendUrl}/dealer/list?page=${page}&elementsByPage=${elementsByPage}&fetchType=${fetchType}`
      )
      .pipe(
        map((response) => {
          if (fetchType === FetchType.LAZY) {
            const { content, totalPages, size, totalElements } =
              response as PaginatedResponse<Dealer>;
            return {
              result: content,
              currentPage: page,
              totalPages,
              elementsByPage: size,
              totalElements,
            };
          } else {
            return response as Dealer[];
          }
        })
      );
  }

  public filterDealer(
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<Dealer>> {
    return this.http
      .get<PaginatedResponse<Dealer>>(
        `${environment.backendUrl}/dealer/filter/${term}?page=${page}&elementsByPage=${elementsByPage}`
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

  public getDealer(id: number): Observable<Dealer> {
    return this.http.get<Dealer>(`${environment.backendUrl}/dealer/${id}`);
  }

  public getDealerByNumber(dealerNumber: string): Observable<Dealer> {
    return this.http.get<Dealer>(
      `${environment.backendUrl}/dealer/number/${dealerNumber}`
    );
  }

  public getDealerByName(name: string): Observable<Dealer> {
    return this.http.get<Dealer>(
      `${environment.backendUrl}/dealer/name/${name}`
    );
  }

  public addDealer(dealer: Dealer): Observable<Dealer> {
    return this.http.post<Dealer>(
      `${environment.backendUrl}/dealer/add`,
      dealer
    );
  }

  public editDealer(dealer: Dealer, id: number): Observable<Dealer> {
    return this.http.put<Dealer>(
      `${environment.backendUrl}/dealer/update/${id}`,
      dealer
    );
  }

  public editDealerStatus(status: boolean, id: number): Observable<Dealer> {
    return this.http.put<Dealer>(
      `${environment.backendUrl}/dealer/update-status/${id}`,
      { status }
    );
  }
}
