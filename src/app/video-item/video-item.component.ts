import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../search-doc/services/search.service';
import { Observable, of } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoItemComponent implements OnInit {
  @Input() videoItem: any;
  thumbnailLink$: Observable<SafeUrl> = of('');

  constructor(
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.thumbnailLink$ = this.getThumbnailLink(this.videoItem);
  }

  getThumbnailLink(item: any): Observable<SafeUrl> {
    const { accountId, videoId, thumbnailId } = item;
    return this.searchService.getVideoThumbnailAsURL(accountId, videoId, thumbnailId);
  }

  navigateToVideoPlayer(accountId: string, videoId: string, startTime: string) {
    this.router.navigate(['/video-player', accountId, videoId, encodeURIComponent(startTime)]);
  }

  onSelectKeyMoment(keyMoment: any, accountId: string, videoId: string) {
    this.navigateToVideoPlayer(accountId, videoId, keyMoment.startTime);
  }

}
