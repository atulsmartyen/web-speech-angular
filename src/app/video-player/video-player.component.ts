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
  accessToken: string = '';

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
      this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl());
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

  getVideoUrl(): string {
    this.accessToken = this.searchService.videoToken;
    return `https://www.videoindexer.ai/embed/player/${this.accountId}/${this.videoId}/?accessToken=${this.accessToken}&locale=en&location=trial`;
  }

  public get apiVersion() {
    return this.insightsWidget?.apiVersion;
  }
}
