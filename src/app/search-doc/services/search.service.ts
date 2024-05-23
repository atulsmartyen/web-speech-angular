import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

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
  private tokenUrl = 'https://func-curatorai.azurewebsites.net/get-token';
  readonly staticVideoThumbnail = '../../assets/images/static-video-thumbneil.png';

  public videoToken: string = '';

  constructor(private http: HttpClient) {
    this.getVideoToken().subscribe((token: any) => {
      this.videoToken = token;
    });
  }

  search(prompt: string) {
    return this.http.get(this.apiUrl + prompt, {});
  }

  searchVideos(prompt: string) {
    return this.http.get(this.videoAPIurl + prompt, {});
  }

  getVideoToken() {
    return !!this.videoToken ? of(this.videoToken) : this.http.get(this.tokenUrl, {});
  }

  getThumbnailLink(accountId: string, videoId: string, thumbnailId: string): string {
    return `https://api.videoindexer.ai/trial/accounts/${accountId}/videos/${videoId}/thumbnails/${thumbnailId}`;
  }
}