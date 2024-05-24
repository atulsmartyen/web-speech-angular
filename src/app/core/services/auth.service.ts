// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = '';
  private tokenUrl = 'https://func-curatorai.azurewebsites.net/get-token';

  constructor(private http: HttpClient) { }

  getToken(): Observable<string> {
    if (!this.token) {
      return this.http.get<string>(this.tokenUrl)
        .pipe(
            tap((token) => {this.token = token})
        );
    } else {
      return of(this.token);
    }
  }
}