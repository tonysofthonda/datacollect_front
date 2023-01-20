import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Terchief } from '@models/terchief.model';
import { Contact } from '@models/contact.model';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponse } from '@models/response.model';
import { environment } from 'src/environments/environment';
import { Paginated } from '@models/common.model';
import { FetchType } from '@enums/fetch-type.enum';

@Injectable({
  providedIn: 'root',
})
export class TerchiefsService {
  constructor(private http: HttpClient) {}

  public getTerchiefs(
    page: number = 0,
    elementsByPage: number = 10,
    fetchType: FetchType = FetchType.LAZY
  ): Observable<Paginated<Terchief> | Terchief[]> {
    return this.http
      .get<PaginatedResponse<Terchief> | Terchief[]>(
        `${environment.backendUrl}/terchief/list?page=${page}&elementsByPage=${elementsByPage}&fetchType=${fetchType}`
      )
      .pipe(
        map((response) => {
          if (fetchType === FetchType.LAZY) {
            const { content, totalPages, size, totalElements } =
              response as PaginatedResponse<Terchief>;
            return {
              result: content,
              currentPage: page,
              totalPages,
              elementsByPage: size,
              totalElements,
            };
          } else {
            return response as Terchief[];
          }
        })
      );
  }

  public filterTerchiefs(
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<Terchief>> {
    return this.http
      .get<PaginatedResponse<Terchief>>(
        `${environment.backendUrl}/terchief/filter/${term}?page=${page}&elementsByPage=${elementsByPage}`
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

  public getTerchief(id: number): Observable<Terchief> {
    return this.http.get<Terchief>(`${environment.backendUrl}/terchief/${id}`);
  }

  public addTerchief(terchief: Terchief): Observable<Terchief> {
    return this.http.post<Terchief>(
      `${environment.backendUrl}/terchief/add`,
      terchief
    );
  }

  public editTerchief(terchief: Terchief, id: number): Observable<Terchief> {
    return this.http.put<Terchief>(
      `${environment.backendUrl}/terchief/update/${id}`,
      terchief
    );
  }

  public removeTerchief(id: number): Observable<boolean> {
    return this.http
      .delete(`${environment.backendUrl}/terchief/disable/${id}`)
      .pipe(map(() => true));
  }

  public getContacts(
    terchiefId: number,
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<Contact>> {
    return this.http
      .get<PaginatedResponse<Contact>>(
        `${environment.backendUrl}/terchief/contacts/${terchiefId}?page=${page}&elementsByPage=${elementsByPage}`
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

  public filterContacts(
    terchiefId: number,
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<Contact>> {
    return this.http
      .get<PaginatedResponse<Contact>>(
        `${environment.backendUrl}/terchief/contacts/filter/${terchiefId}/${term}?page=${page}&elementsByPage=${elementsByPage}`
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

  public addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(
      `${environment.backendUrl}/terchief/contacts/add`,
      contact
    );
  }

  public editContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(
      `${environment.backendUrl}/contact/update`,
      contact
    );
  }

  public removeContact(id: number): Observable<boolean> {
    return this.http
      .delete(`${environment.backendUrl}/contact/disable/${id}`)
      .pipe(map(() => true));
  }
}
