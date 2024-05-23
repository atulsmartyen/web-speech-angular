import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search-doc/services/search.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  CustomInsightsWidget,
  IBaseStyleConfig,
  ICustomColorElement,
  ICustomData,
  ICustomElement,
  ICustomInsightsWidgetConfig,
  IEmotion,
  ITopic,
  IInsightsWidgetConfig,
  IWidgetStyle,
  InsightsWidget,
  IWidgetOptions
} from '@azure/video-indexer-widgets';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements OnInit {
  public insightsWidget: InsightsWidget = {} as InsightsWidget;
  accountId: string = '';
  videoId: string = '';
  videoUrl: SafeUrl = '';
  insightsUrl: SafeUrl = '';
  accessToken: string = '';
  startTime: string = '00.00.00.00';

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    public domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.accountId = params.get('accountId') ?? '' ;
      this.videoId = params.get('videoId') ?? '';
      this.startTime = decodeURIComponent(params.get('startTime') ?? '');
      this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(this.startTime));
      console.log('videoUrl:', this.videoUrl);
      this.insightsUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.getInsightsUrl());
    });
  }

  public ngAfterViewInit(): void {
    const insightsStyleConfig2: IBaseStyleConfig = {
        primary: 'yellow',
        dividers: 'rgba(134,28,173,1)'
    };

    const style: IWidgetStyle = {
        customStyle: insightsStyleConfig2,
        theme: 'Dark'
    };

    const config: IInsightsWidgetConfig = {
        accountId: this.accountId,
        videoId: this.videoId,
        accessToken: this.accessToken,
        locale: 'en-us',
        tab: 'timeline',
        components: ['transcript', 'keywords'],
        style: style
    };

    const widgetOptions: IWidgetOptions = {
        height: 780,
        width: '100%'
    };

    this.insightsWidget = new InsightsWidget('container', widgetOptions, config);
    this.insightsWidget.render();
  }

  getVideoUrl(startTime: string): string {
    this.accessToken = this.searchService.videoToken;
    return `https://www.videoindexer.ai/embed/player/${this.accountId}/${this.videoId}/?accessToken=${this.accessToken}&locale=en&location=trial?t=${this.getNoOfSecs(startTime)}`;
  }

  getNoOfSecs(startTime: string): number {
    const parts = startTime.split(':');
    const hours = +parts[0];
    const minutes = +parts[1];
    const secondsParts = parts[2].split('.');
    const seconds = +secondsParts[0];
    //const milliseconds = secondsParts[1] ? +secondsParts[1] / 1000 : 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    console.log('totalSeconds:', totalSeconds);
    return totalSeconds;
  }

  getInsightsUrl(): string {
    return `https://www.videoindexer.ai/embed/insights/${this.accountId}/${this.videoId}/?accessToken=${this.accessToken}&locale=en&location=trial`;
  }

  public get apiVersion() {
    return this.insightsWidget?.apiVersion;
  }
}
