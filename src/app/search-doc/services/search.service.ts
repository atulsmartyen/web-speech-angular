import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';

export interface SearchItem {
    fileName ?: string,
    title ?: string,
    subtitle ?: string,
    description ?: string,
    data ?: string,
    metadata ?: {
        page ?: number,
        source ?: string
    }
}

export interface SearchVideoItem {
  accountId: string,
  thumbnailVideoId: string,
  thumbnailId: string,
  name: string,
  searchMatches: SearchMatch[]
}

export interface SearchMatch {
  startTime: string,
  type: string,
  text: string
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://func-curatorai.azurewebsites.net/query-prompt-docs?prompt=';
  private videoAPIurl = 'https://func-curatorai.azurewebsites.net/query-prompt-videos?prompt=';
  readonly staticVideoThumbnail = '../../assets/images/static-video-thumbneil.png';

  public videoToken: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getToken()
      .subscribe((token: any) => {
        this.videoToken = token;
      });
  }

  search(prompt: string) {
    return this.http.get(this.apiUrl + prompt, {});
  }

  searchVideos(prompt: string) {
    return this.http.get(this.videoAPIurl + prompt, {});
  }

  getVideoThumbnailAsURL(accountId: string, videoId: string, thumbnailId: string): Observable<string> {
    return this.http
      .get(this.getThumbnailLink(accountId, videoId, thumbnailId), { responseType: 'blob' })
      .pipe(
        mergeMap((imgData) => {
          return <string>this.readBlobAsURL(imgData as Blob);
        })
      )
  }

  public readBlobAsURL = (blob: Blob): any => {
    if (!(blob instanceof Blob)) {
      return throwError(() => new Error('`blob` must be an instance of File or Blob.'));
    }
    if (blob.size == 0 && blob.type == "") {
      return of('');
    }
    return new Observable(obs => {
      const reader = new FileReader();
      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result);
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(blob);
    });
  }

  getThumbnailLink(accountId: string, videoId: string, thumbnailId: string): string {
    return `https://api.videoindexer.ai/trial/accounts/${accountId}/videos/${videoId}/thumbnails/${thumbnailId}`;
  }
}