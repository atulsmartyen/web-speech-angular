import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchItem, SearchVideoItem, SearchService } from './services/search.service';
import { Observable, of } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'search-doc',
  templateUrl: './search-doc.component.html',
  styleUrls: ['./search-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDocComponent implements OnInit {
  panelOpenState = true;
  searchText: string = 'what are main components of V60 depositor machine ?';
  searchedItems$: Observable<any[] | undefined>;
  searchedItems;
  searchedVideoItems$: Observable<any[] | undefined>;
  searchedVideoItems;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService) {
      
    }

  ngOnInit() {
    // this.route.paramMap.pipe(take(1)).subscribe(params => {
    //   this.searchText = params.get('input') ?? '' ;
    //   if (this.searchText) { this.onSearch(); }
    // });
  }

  navigateToWebSpeech() {
    this.router.navigate(['/web-speech']);
  }

  onSearch() {
    this.searchedItems$ = this.searchItemsBasedOnPrompt(this.searchText)
      .pipe(
        map((data: any) => {
          try {
            console.log('data : ',data);
            const parsedData = JSON.parse(data);
            const groupedItems = parsedData.fileName ? [{...parsedData}].map((item:any) => {
              return {
                title: item.fileName,
                subtitle: `${10/parseInt(item.metadata)}`,
                description: `${item.data}`
              }
            }) : [];
      
            if(!groupedItems) { return [] }
            // Convert the object back to an array
            this.searchedItems = Object.values(groupedItems); 
            return this.searchedItems;
          } catch (error) {
            console.error('Error parsing data:', error);
            this.searchedItems = [];
            return this.searchedItems;
          }
        })
      );

    this.searchedVideoItems$ = this.searchVideoItemsBasedOnPrompt(this.searchText)
      .pipe(
        map((data: any) => {
          try {
            const parsedData = JSON.parse(data);
            const groupedItems = parsedData.fileName ? [{...parsedData}].map((item:any) => {
              return {
                title: item.fileName,
                subtitle: `${10/parseInt(item.metadata)}`,
                time: item.metadata,
                description: `${item.data}`
              }
            }) : [];
      
            if(!groupedItems) { return [] }
            // Convert the object back to an array
            this.searchedVideoItems = Object.values(groupedItems);
            return this.searchedVideoItems;
          } catch (error) {
            console.error('Error parsing data:', error);
            this.searchedVideoItems = []; 
            return this.searchedVideoItems;
          }
        })
      );

    this.searchedItems$.subscribe();
    this.searchedVideoItems$.subscribe();
  }

  onUpload() {
    this.router.navigate(['/upload-document']);
  }

  transformNewlines(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  searchItemsBasedOnPrompt(prompt: string) {
    if (!prompt) { return of('{"results":[]}'); }
    return this.searchService.search(prompt);
  }

  searchVideoItemsBasedOnPrompt(prompt: string) {
    if (!prompt) { return of('{"results":[]}'); }
    return this.searchService.searchVideos(prompt);
  }

  navigateToVideoPlayer(startTime: string) {
    const accountId: string = '1e1039c3-2aa4-4d7d-b9d2-a41a7967441e';
    const videoId: string = 'e2a1mlnen7';

    this.router.navigate(['/video-player', accountId, videoId, encodeURIComponent(startTime)]);
  }
}
