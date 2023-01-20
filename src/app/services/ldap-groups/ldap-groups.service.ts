import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LdapGroup } from '@models/ldap-group.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LdapGroupsService {

  constructor(private http: HttpClient) { }

  getLdapGroups(): Observable<LdapGroup[]> {
    return this.http.get<LdapGroup[]>(
      `${environment.backendUrl}/ldap-group/list`
    );
  }

  public getLdapGroupByLdapId(ldapId: string): Observable<LdapGroup> {
    return this.http.get<LdapGroup>(
      `${environment.backendUrl}/ldap-group/ldap-id/${ldapId}`
    );
  }
}
