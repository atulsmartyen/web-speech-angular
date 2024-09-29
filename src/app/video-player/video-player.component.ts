import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search-doc/services/search.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements OnInit {
  accountId: string = '';
  videoId: string = '';
  videoUrl: Observable<SafeUrl> = new Observable<SafeUrl>();
  insightsUrl: SafeUrl = '';
  accessToken: string = '';
  startTime: string = '00.00.00.00';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.accountId = params.get('accountId') ?? '' ;
      this.videoId = params.get('videoId') ?? '';
      this.startTime = decodeURIComponent(params.get('startTime') ?? '');
      this.videoUrl = this.getVideoUrl();
      //this.insightsUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.getInsightsUrl());
    });
  }

  getVideoUrl(): Observable<SafeResourceUrl> {
    return this.authService
      .getToken()
      .pipe(
        map((token: any) => {
          this.accessToken = token;
          const videoUrl = `https://www.videoindexer.ai/embed/player/${this.accountId}/${this.videoId}/?accessToken=${this.accessToken}&locale=en&location=trial&t=${this.getNoOfSecs(this.startTime)}`;
          const videoUrlSafe = this.domSanitizer.bypassSecurityTrustResourceUrl(videoUrl);
          return videoUrlSafe;
        }));
  }

  getNoOfSecs(startTime: string): number {
    try {
      const parts = startTime.split(':');
      const hours = +parts[0];
      const minutes = +parts[1];
      const secondsParts = parts[2].split('.');
      const seconds = +secondsParts[0];
      //const milliseconds = secondsParts[1] ? +secondsParts[1] / 1000 : 0;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      return totalSeconds;
    } catch(e) {
      return 0;
    }
  }

  getInsightsUrl(): string {
    this.accountId = '1e1039c3-2aa4-4d7d-b9d2-a41a7967441e';
    this.videoId = 'e2a1mlnen7';
    return `https://www.videoindexer.ai/embed/insights/${this.accountId}/${this.videoId}/?accessToken=${this.accessToken}&locale=en&location=trial`;
  }
}
