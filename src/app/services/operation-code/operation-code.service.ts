import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '@models/common.model';
import { OperationCode } from '@models/operation-code.model';
import { PaginatedResponse } from '@models/response.model';
import { SelectItem } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationCodeService {

  constructor(private http: HttpClient) {}

  public getOperationCode(
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<OperationCode>> {
    return this.http
      .get<PaginatedResponse<OperationCode>>(
        `${environment.backendUrl}/operation/code?page=${page}&elementsByPage=${elementsByPage}`
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

  findOperationCodeRecord(id: number) : Observable<OperationCode> {
      return this.http.get<OperationCode>(`${environment.backendUrl}/operation/code/${id}`);
  }

  addOperationCode(operationCode: OperationCode): Observable<OperationCode> {
    return this.http.post<OperationCode>(`${environment.backendUrl}/operation/code/`, operationCode);
  }

  updateOperationCode(operationCode: OperationCode): Observable<OperationCode> {
    return this.http.put<OperationCode>(`${environment.backendUrl}/operation/code/`, operationCode);
  }

  filterOperationCode(term: string = '', page: number = 0, elementsByPage: number = 10): Observable<Paginated<OperationCode>> {
    return this.http
      .get<PaginatedResponse<OperationCode>>(
        `${environment.backendUrl}/operation/code/filter/${term}?page=${page}&elementsByPage=${elementsByPage}`
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
}
