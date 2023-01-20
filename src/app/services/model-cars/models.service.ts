import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '@models/common.model';
import { Model } from '@models/model.model';
import { PaginatedResponse } from '@models/response.model';
import { map, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  constructor(private http: HttpClient) {}

  public getModels(
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<Model>> {
    return this.http
      .get<PaginatedResponse<Model>>(
        `${environment.backendUrl}/model/list?page=${page}&elementsByPage=${elementsByPage}`
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

  public filterModel(
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<Model>> {
    return this.http
      .get<PaginatedResponse<Model>>(
        `${environment.backendUrl}/model/filter/${term}?page=${page}&elementsByPage=${elementsByPage}`
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

  public getModel(id: number): Observable<Model> {
    return this.http.get<Model>(`${environment.backendUrl}/model/${id}`);
  }

  public getModelByCodeAndYear(code: string, year: string): Observable<Model> {
    return this.http.get<Model>(
      `${environment.backendUrl}/model/code-year/${code}/${year}`
    );
  }

  public addModel(model: Model): Observable<Model> {
    return this.http.post<Model>(`${environment.backendUrl}/model/add`, model)
    .pipe(switchMap((model)=>this.updateHondaNewCarRetailFormulas().pipe(map(()=>model))));
  }

  public editModel(model: Model, id: number): Observable<Model> {
    return this.http.put<Model>(
      `${environment.backendUrl}/model/update/${id}`,
      model
    ).pipe(switchMap((model)=>this.updateHondaNewCarRetailFormulas().pipe(map(()=>model))));
  }

  public editModelStatus(status: boolean, id: number): Observable<Model> {
    return this.http
      .put<Model>(`${environment.backendUrl}/model/update-status/${id}`, {status});
  }

  private updateHondaNewCarRetailFormulas():Observable<string>{
    return this.http.post<string>(`${environment.backendUrl}/model/update-honda-new-car-retail-formulas`, null);
  }
}
