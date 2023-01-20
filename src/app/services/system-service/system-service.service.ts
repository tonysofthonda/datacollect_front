import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemService } from '@models/system-service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemServiceService {

  constructor(private http: HttpClient) { }

  getSystemServices(): Observable<SystemService[]> {
    return this.http.get<SystemService[]>(
      `${environment.backendUrl}/system-service/list`
    );
  }
}
