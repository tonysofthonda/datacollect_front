import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { View } from '@models/view.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewsService {

  constructor(private http: HttpClient) { }

  getViews(): Observable<View[]> {
    return this.http.get<View[]>(
      `${environment.backendUrl}/view/list`
    );
  }
}
