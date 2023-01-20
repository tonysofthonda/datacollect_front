import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FetchType } from '@enums/fetch-type.enum';
import { Paginated } from '@models/common.model';
import { Facility } from '@models/facility.model';
import { PaginatedResponse } from '@models/response.model';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  constructor(private http: HttpClient) {}

  public getFacilities(
    page: number = 0,
    elementsByPage: number = 10,
    fetchType: FetchType = FetchType.LAZY
  ): Observable<Paginated<Facility> | Facility[]> {
    return this.http
      .get<PaginatedResponse<Facility> | Facility[]>(
        `${environment.backendUrl}/facility/list?page=${page}&elementsByPage=${elementsByPage}&fetchType=${fetchType}`
      )
      .pipe(
        map(response => {
          if (fetchType === FetchType.LAZY) {
            const { content, totalPages, size, totalElements } =
              response as PaginatedResponse<Facility>;
            return {
              result: content,
              currentPage: page,
              totalPages,
              elementsByPage: size,
              totalElements,
            };
          } else {
            return response as Facility[];
          }
        })
      );
  }

  public filterFacility(
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<Facility>> {
    return this.http
      .get<PaginatedResponse<Facility>>(
        `${environment.backendUrl}/facility/filter/${term}?page=${page}&elementsByPage=${elementsByPage}`
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

  public getFacility(id: number): Observable<Facility> {
    return this.http.get<Facility>(
      `${environment.backendUrl}/facility/${id}`
    );
  }

  public addFacility(facility: Facility): Observable<Facility> {
    return this.http.post<Facility>(
      `${environment.backendUrl}/facility/add`,
      facility
    );
  }

  public editFacility(facility: Facility, id: number): Observable<Facility> {
    return this.http.put<Facility>(
      `${environment.backendUrl}/facility/update/${id}`,
      facility
    );
  }

  public removeFacility(id: number): Observable<boolean> {
    return this.http
      .delete(`${environment.backendUrl}/facility/disable/${id}`)
      .pipe(map(() => true));
  }
}
