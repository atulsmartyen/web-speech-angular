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
  searchText: string = '';
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
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      this.searchText = params.get('input') ?? '' ;
      this.onSearch();
    });
  }

  navigateToWebSpeech() {
    this.router.navigate(['/web-speech']);
  }

  onSearch() {
    this.searchedItems$ = this.searchItemsBasedOnPrompt(this.searchText)
      .pipe(
        take(1),
        map((data: any) => {
          // const groupedItems = (Object.values(data) as Array<SearchItem[]>)
          //   .flat()
          //   .reduce((acc: { [key: string]: SearchItem[] }, item: SearchItem) => {
          //     if (!item) return acc;

          //     const key = item?.fileName;
          //     if (!key) return acc;
    
          //     if (!acc[key]) {
          //       acc[key] = [];
          //     }
    
          //     if(!item.metadata) {  return acc; }

          //     acc[key].push({
          //       title: item.fileName,
          //       subtitle: `Page: ${item.metadata.page}`,
          //       description: `${item.data}`
          //     });

          //     return acc;
          //   }, {});
          try {
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
        take(1),
        map((data: any) => {
          try {
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
    if (!prompt) { return of([]); }
    return this.searchService.search(prompt);
  }

  searchVideoItemsBasedOnPrompt(prompt: string) {
    if (!prompt) { return of('{"results":[]}'); }
    return this.searchService.searchVideos(prompt);
  }
}
