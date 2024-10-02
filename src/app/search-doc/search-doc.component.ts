import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchItem, SearchVideoItem, SearchService } from './services/search.service';
import { Observable, of } from 'rxjs';
import { concatMap, debounceTime, first, switchMap, take, tap } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { concat, timer } from 'rxjs';
  import { map, finalize } from 'rxjs/operators';

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

  isDocLoading: boolean = false;  // Indicates if document search is loading
  isVideoLoading: boolean = false; // Indicates if video search is loading

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService) {
      
    }

  ngOnInit() {
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      this.searchText = params.get('input') ?? this.searchText ;
      if (this.searchText) { this.onSearch(); }
    });
  }

  navigateToWebSpeech() {
    this.router.navigate(['/web-speech']);
  }

  onSearch() {
    // Set document loading state to true
    this.isDocLoading = true;
  
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
            this.searchedItems = Object.values(groupedItems);
            return this.searchedItems;
          } catch (error) {
            console.error('Error parsing data:', error);
            this.searchedItems = [];
            return this.searchedItems;
          }
        }),
        finalize(() => {
          this.isDocLoading = false;  // Set document loading state to false after completion
        })
      );
  
    // Video search observable (with 1-minute delay)
    const videoSearch$ = timer(61000).pipe(
      take(1), // Ensure the delay is respected and the observable completes after one emission
      tap(() => {
        this.isVideoLoading = true; // Set video loading state to true when search starts
      }),
      concatMap(() => this.searchVideoItemsBasedOnPrompt(this.searchText)
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
              return this.searchedVideoItems;
            } catch (error) {
              console.error('Error parsing video data:', error);
              this.searchedVideoItems = [];
              return this.searchedVideoItems;
            }
          }),
          finalize(() => {
            this.isVideoLoading = false;  // Set video loading state to false after completion
          })
        )
      )
    );
  
    // Debouncing to ensure the search triggers only after 500ms of no typing
  const search$ = of(this.searchText).pipe(
    debounceTime(500),
    switchMap(() => concat(
      documentSearch$,  // First document search
      videoSearch$      // Then video search
    ))
  );

  search$.subscribe();
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
