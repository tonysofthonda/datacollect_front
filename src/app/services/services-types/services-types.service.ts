import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceType } from '@models/service-type.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServicesTypesService {
  constructor(private http: HttpClient) {}

  getServicesTypes(): Observable<ServiceType[]> {
    return this.http.get<ServiceType[]>(
      `${environment.backendUrl}/service-type/list`
    );
  }
}
