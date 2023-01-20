import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '@models/common.model';
import { DealerFacility } from '@models/dealer-facility.model';
import { PaginatedResponse } from '@models/response.model';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DealerFacilitiesService {

  constructor(private http: HttpClient) { }

  public getDealerFacilities(
    dealerId: number,
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<DealerFacility>> {
    return this.http
      .get<PaginatedResponse<DealerFacility>>(
        `${environment.backendUrl}/dealer/facilities/${dealerId}?page=${page}&elementsByPage=${elementsByPage}`
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

  public filterDealerFacility(
    dealerId: number,
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<DealerFacility>> {
    return this.http
      .get<PaginatedResponse<DealerFacility>>(
        `${environment.backendUrl}/dealer/facilities/filter/${dealerId}/${term}?page=${page}&elementsByPage=${elementsByPage}`
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

  public getDealerFacility(dealerId: number, facilityId: number): Observable<DealerFacility> {
    return this.http.get<DealerFacility>(`${environment.backendUrl}/dealer/facilities/${dealerId}/${facilityId}`);
  }

  public addDealerFacility(dealerFacility: DealerFacility): Observable<DealerFacility> {
    return this.http.post<DealerFacility>(
      `${environment.backendUrl}/dealer/facilities/add`,
      dealerFacility
    );
  }

  public editDealerFacility(dealerFacility: DealerFacility): Observable<DealerFacility> {
    return this.http.put<DealerFacility>(
      `${environment.backendUrl}/dealer/facilities/update`,
      dealerFacility
    );
  }

  public removeDealerFacility(dealerFacility: DealerFacility): Observable<DealerFacility> {
    return this.http.delete<DealerFacility>(
      `${environment.backendUrl}/dealer/facilities/delete`,
      {body: dealerFacility}
    );
  }
}
