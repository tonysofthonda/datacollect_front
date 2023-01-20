import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '@models/common.model';
import { DealerContact } from '@models/dealer-contact';
import { PaginatedResponse } from '@models/response.model';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DealerContactsService {
  constructor(private http: HttpClient) {}

  public getDealerContacts(
    dealerId: number,
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<DealerContact>> {
    return this.http
      .get<PaginatedResponse<DealerContact>>(
        `${environment.backendUrl}/dealer/contact/list/${dealerId}?page=${page}&elementsByPage=${elementsByPage}`
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

  public filterDealerContact(
    dealerId: number,
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<DealerContact>> {
    return this.http
      .get<PaginatedResponse<DealerContact>>(
        `${environment.backendUrl}/dealer/contact/filter/${dealerId}/${term}?page=${page}&elementsByPage=${elementsByPage}`
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

  public getDealerContact(id: number): Observable<DealerContact> {
    return this.http.get<DealerContact>(
      `${environment.backendUrl}/dealer/contact/${id}`
    );
  }

  public addDealerContact(dealerContact: DealerContact): Observable<DealerContact> {
    return this.http.post<DealerContact>(
      `${environment.backendUrl}/dealer/contact/add`,
      dealerContact
    );
  }

  public editDealerContact(
    dealerContact: DealerContact,
    id: number
  ): Observable<DealerContact> {
    return this.http.put<DealerContact>(
      `${environment.backendUrl}/dealer/contact/update/${id}`,
      dealerContact
    );
  }

  public removeDealerContact(id: number): Observable<boolean> {
    return this.http
      .delete(`${environment.backendUrl}/dealer/contact/delete/${id}`)
      .pipe(map(() => true));
  }
}
