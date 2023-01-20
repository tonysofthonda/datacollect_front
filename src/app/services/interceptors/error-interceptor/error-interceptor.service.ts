import { HttpErrorResponse,HttpEvent,HttpHandler,HttpInterceptor,HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private messageService: MessageService) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(httpRequest).pipe(
      catchError((err: HttpErrorResponse) => {
        const severity = err.error?.friendlyError?.status || 'error';
        const detail = err.error?.friendlyError?.message || err.error;
        this.messageService.add({
          severity,
          summary: 'An error has ocurred',
          detail,
          life: 5000,
          closable: true,
        });
        const error = new Error(err.message);
        return throwError(() => error);
      })
    );
  }
}
