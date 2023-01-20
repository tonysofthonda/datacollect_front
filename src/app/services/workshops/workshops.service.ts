import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workshop } from '@models/workshop.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkshopsService {
  constructor(private http: HttpClient) {}

  public getWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${environment.backendUrl}/workshop/list`);
  }
}
