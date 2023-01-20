import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Position } from '@models/position.model';
import { environment } from "src/environments/environment"
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private http: HttpClient) { }

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(
      `${environment.backendUrl}/position/list`
    );
  }

  public getPositionByJobId(jobId: string): Observable<Position> {
    return this.http.get<Position>(
      `${environment.backendUrl}/position/job-id/${jobId}`
    );
  }
}
