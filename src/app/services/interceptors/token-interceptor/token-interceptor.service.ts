import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const access_token = httpRequest.body?.access_token;
    const isLogin = httpRequest.headers.get("Content-Type") === 'application/x-www-form-urlencoded'
    if(access_token && !isLogin){
      httpRequest = httpRequest.clone({headers: httpRequest.headers.set('Authorization',`Bearer ${access_token}`), withCredentials: true});
    }
    return next.handle(httpRequest);
  }
}
