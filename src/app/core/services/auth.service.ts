// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public tokenUrl = 'https://func-curator.azurewebsites.net/api/get-token';

  constructor(private http: HttpClient) { }

  private token: string | null = null;
  private tokenRequest$: Observable<string> | null = null;

  getToken(): Observable<string> {
    // Return the cached token if it's available
    if (this.token) {
      return of(this.token);
    }

    // If a token request is already in progress, return that observable
    if (this.tokenRequest$) {
      return this.tokenRequest$;
    }

    // If no token and no request in progress, make the API call and cache the result
    this.tokenRequest$ = this.http.get(this.tokenUrl, { responseType: 'text' }).pipe(
      tap((token) => {
        console.log('token : ',token);
        this.token = token; // Cache the token
      }),
      shareReplay(1), // Share the response with any other subscribers and cache it
      tap(() => {
        this.tokenRequest$ = null; // Reset the request observable after it's done
      })
    );

    return this.tokenRequest$;
  }
}
