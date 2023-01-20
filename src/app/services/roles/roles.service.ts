import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FetchType } from '@enums/fetch-type.enum';
import { Paginated } from '@models/common.model';
import { LdapGroup } from '@models/ldap-group.model';
import { Position } from '@models/position.model';
import { PaginatedResponse } from '@models/response.model';
import { Role } from '@models/role.model';
import { ViewAction } from '@models/view.model';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  ldapGroupsFormSelected: LdapGroup[] = [];
  positionsFormSelected: Position[] = [];
  permissionsFormSelected: ViewAction[] = [];

  constructor(private http: HttpClient) { }

  public getRoles(
    page: number = 0,
    elementsByPage: number = 10,
    fetchType: FetchType = FetchType.LAZY
  ): Observable<Paginated<Role> | Role[]> {
    return this.http
      .get<PaginatedResponse<Role> | Role[]>(
        `${environment.backendUrl}/role/list?page=${page}&elementsByPage=${elementsByPage}&fetchType=${fetchType}`
      )
      .pipe(
        map(response => {
          if (fetchType === FetchType.LAZY) {
            const { content, totalPages, size, totalElements } =
              response as PaginatedResponse<Role>;
            return {
              result: content,
              currentPage: page,
              totalPages,
              elementsByPage: size,
              totalElements,
            };
          } else {
            return response as Role[];
          }
        })
      );
  }

  public filterRole(
    term: string = '',
    page: number = 0,
    elementsByPage: number = 10
  ): Observable<Paginated<Role>>{
    return this.http
      .get<PaginatedResponse<Role>>(
        `${environment.backendUrl}/role/filter/${term}?page=${page}&elementsByPage=${elementsByPage}`
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

  public getRole(id: number): Observable<Role> {
    return this.http.get<Role>(
      `${environment.backendUrl}/role/${id}`
    );
  }

  public getRoleByName(name: string): Observable<Role> {
    return this.http.get<Role>(
      `${environment.backendUrl}/role/name/${name}`
    );
  }

  public addRole(role: Role): Observable<Role> {
    role.ldapGroups = this.ldapGroupsFormSelected;
    role.positions = this.positionsFormSelected;
    role.permissions = this.permissionsFormSelected;
    return this.http.post<Role>(
      `${environment.backendUrl}/role/add`,
      role
    ).pipe(map((response)=>{
      this.ldapGroupsFormSelected = [];
      this.positionsFormSelected = [];
      this.permissionsFormSelected = [];
      return response;
    }));
  }

  public editRole(role: Role, id: number): Observable<Role> {
    role.ldapGroups = this.ldapGroupsFormSelected;
    role.positions = this.positionsFormSelected;
    role.permissions = this.permissionsFormSelected;
    return this.http.put<Role>(
      `${environment.backendUrl}/role/update/${id}`,
      role
    ).pipe(map((response)=>{
      this.ldapGroupsFormSelected = [];
      this.positionsFormSelected = [];
      this.permissionsFormSelected = [];
      return response;
    }));
  }

  public removeRole(id: number): Observable<boolean> {
    return this.http
      .delete(`${environment.backendUrl}/role/delete/${id}`)
      .pipe(map(() => true));
  }
}
