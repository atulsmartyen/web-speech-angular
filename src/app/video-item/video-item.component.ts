import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchService } from '../search-doc/services/search.service';

@Component({
  selector: 'video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoItemComponent {
  @Input() videoItem: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService) {}

  getVideoThumbneil(item: any): Observable<string> {
    const { accountId, videoId, thumbnailId } = item;
    return this.searchService.getThumbnail(accountId, videoId, thumbnailId);
  }

  navigateToVideoPlayer(accountId: string, videoId: string) {
    this.router.navigate(['/video-player', accountId, videoId]);
  }

}
