import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FetchType } from '@enums/fetch-type.enum';
import { Paginated } from '@models/common.model';
import { DealerGroup } from '@models/dealer-group.model';
import { PaginatedResponse } from '@models/response.model';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DealerGroupsService {
  constructor(private http: HttpClient) {}

  public getDealerGroups(
    page: number = 0,
    elementsByPage: number = 10,
    fetchType: FetchType = FetchType.LAZY
  ): Observable<Paginated<DealerGroup> | DealerGroup[]> {
    return this.http
      .get<PaginatedResponse<DealerGroup> | DealerGroup[]>(
        `${environment.backendUrl}/dealer-group/list?page=${page}&elementsByPage=${elementsByPage}&fetchType=${fetchType}`
      )
      .pipe(
        map((response) => {
          if (fetchType === FetchType.LAZY) {
            const { content, totalPages, size, totalElements } =
              response as PaginatedResponse<DealerGroup>;
            return {
              result: content,
              currentPage: page,
              totalPages,
              elementsByPage: size,
              totalElements,
            };
          } else {
            return response as DealerGroup[];
          }
        })
      );
  }

  public filterDealerGroup(
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<DealerGroup>> {
    return this.http
      .get<PaginatedResponse<DealerGroup>>(
        `${environment.backendUrl}/dealer-group/filter/${term}?page=${page}&elementsByPage=${elementsByPage}`
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

  public getDealerGroup(id: number): Observable<DealerGroup> {
    return this.http.get<DealerGroup>(
      `${environment.backendUrl}/dealer-group/${id}`
    );
  }

  public getDealerGroupByName(name: string): Observable<DealerGroup>{
    return this.http.get<DealerGroup>(`${environment.backendUrl}/dealer-group/name/${name}`);
  }

  public addDealerGroup(dealerGroup: DealerGroup): Observable<DealerGroup> {
    return this.http.post<DealerGroup>(
      `${environment.backendUrl}/dealer-group/add`,
      dealerGroup
    );
  }

  public editDealerGroup(
    dealerGroup: DealerGroup,
    id: number
  ): Observable<DealerGroup> {
    return this.http.put<DealerGroup>(
      `${environment.backendUrl}/dealer-group/update/${id}`,
      dealerGroup
    );
  }

  public removeDealerGroup(id: number): Observable<boolean> {
    return this.http
      .delete(`${environment.backendUrl}/dealer-group/delete/${id}`)
      .pipe(map(() => true));
  }
}
