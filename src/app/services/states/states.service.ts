import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '@models/state.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  constructor(private http: HttpClient) { }

  public getStates():Observable<State[]>{
    return this.http.get<State[]>(`${environment.backendUrl}/state/list`);
  }
}
