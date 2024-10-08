// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url === this.authService.tokenUrl) {
      return next.handle(request);
    }
  
    return this.authService.getToken()
      .pipe(
        switchMap(token => {
          const cloned = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
          });

          return next.handle(cloned);
        })
      );
  }
}