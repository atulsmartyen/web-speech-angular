import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchItem, SearchVideoItem, SearchService } from './services/search.service';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, debounceTime, first, switchMap, take, tap } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { concat, timer } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

@Component({
  selector: 'search-doc',
  templateUrl: './search-doc.component.html',
  styleUrls: ['./search-doc.component.css'],
})
export class SearchDocComponent implements OnInit {
  panelOpenState = true;
  searchText: string = 'what are main components of V60 depositor machine ?';
  searchedDocItems;
  searchedVideoItems;

  currentSelectedTab: number = 0;

  isResultLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService) {
      
    }

  ngOnInit() {
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      this.searchText = params.get('input') ?? this.searchText ;
      //if (this.searchText) { this.onSearch(); }
    });
  }

  navigateToWebSpeech() {
    this.router.navigate(['/web-speech']);
  }

  onSelectedTabChange(tab) {
    this.currentSelectedTab = tab.index;
  }

  onSearch() {
  
    // Document search observable
    const documentSearch$ = this.searchItemsBasedOnPrompt(this.searchText)
      .pipe(
        take(1), // Ensure we take only one response
        map((data: any) => {
          try {
            const parsedData = JSON.parse(data);
            const groupedItems = parsedData.fileName ? [{ ...parsedData }].map((item: any) => {
              return {
                title: item.fileName,
                subtitle: `${10 / parseInt(item.metadata)}`,
                description: `${item.data}`
              };
            }) : [];
  
            if (!groupedItems) { return []; }
            this.searchedDocItems = Object.values(groupedItems);
            this.isResultLoading = false;
            return this.searchedDocItems;
          } catch (error) {
            this.searchedDocItems = [];
            this.isResultLoading = false;
            return this.searchedDocItems;
          }
        }),
        catchError(() => {
          this.isResultLoading = false;
          this.searchedDocItems = [];

          return this.searchedDocItems;
        })
      );
  
    const videoSearch$ = this.searchVideoItemsBasedOnPrompt(this.searchText)
        .pipe(
          map((data: any) => {
            try {
              const parsedData = JSON.parse(data);
              const groupedItems = parsedData.fileName ? [{ ...parsedData }].map((item: any) => {
                return {
                  title: item.fileName,
                  subtitle: `${10 / parseInt(item.metadata)}`,
                  time: item.metadata,
                  description: `${item.data}`
                };
              }) : [];
  
              if (!groupedItems) { return []; }
              this.searchedVideoItems = Object.values(groupedItems);
              this.isResultLoading = false;
              return this.searchedVideoItems;
            } catch (error) {
              console.error('Error parsing video data:', error);
              this.searchedVideoItems = [];
              this.isResultLoading = false;
              return this.searchedVideoItems;
            }
          }),
          catchError(() => {
            this.isResultLoading = false;
            this.searchedVideoItems = [];
    
            return this.searchedVideoItems;
          })
        );
  
    this.isResultLoading = true;

    if (this.currentSelectedTab === 0) {
      documentSearch$.subscribe();
    }

    if(this.currentSelectedTab === 1) {
      videoSearch$.subscribe();
    }

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
