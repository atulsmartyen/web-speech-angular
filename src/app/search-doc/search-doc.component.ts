import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchItem, SearchVideoItem, SearchService } from './services/search.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'search-doc',
  templateUrl: './search-doc.component.html',
  styleUrls: ['./search-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDocComponent implements OnInit {
  panelOpenState = true;
  searchText: string = '';
  searchedItems: Observable<any[] | undefined> = of([]);
  searchedVideoItems: Observable<any[] | undefined> = of([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService) {
      
    }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.searchText = params.get('input') ?? '' ;
      this.onSearch();
    });
  }

  onSearch() {
    this.searchedItems = this.searchItemsBasedOnPrompt(this.searchText)
    .pipe(
      map((data: any) => {
        const groupedItems = (Object.values(data) as Array<SearchItem[]>)
          .flat()
          .reduce((acc: { [key: string]: SearchItem[] }, item: SearchItem) => {
            if (!item) return acc;

            const key = item?.fileName;
            if (!key) return acc;
  
            if (!acc[key]) {
              acc[key] = [];
            }
  
            if(!item.metadata) {  return acc; }

            acc[key].push({
              title: item.fileName,
              subtitle: `Page: ${item.metadata.page}`,
              description: `${item.data}`
            });

            return acc;
          }, {});
  
        console.log('groupedItems:', groupedItems);
        if(!groupedItems) { return [] }
        // Convert the object back to an array
        return Object.values(groupedItems);
      })
    );

    this.searchedItems.subscribe(items=> console.log('search items : ', items));

    this.searchedVideoItems = this.searchVideoItemsBasedOnPrompt(this.searchText)
      .pipe(
        map((data: any) => {
          try {
            const parsedData = JSON.parse(data);
            return parsedData.results.map((item: SearchVideoItem) => {
                return {
                  title: item.name,
                  subtitle: `Acc ID: ${item.accountId}`,
                  videoId: item.thumbnailVideoId,
                  accountId: item.accountId,
                  thumbnailId: item.thumbnailId,
                  description: [...item.searchMatches.map(match => {
                    const matchObj = { startTime : match.startTime, text: match.text };
                    return matchObj;
                  })]
              };
            })
          } catch (error) {
            console.error('Error parsing data:', error);
            return [];
          }
        })
      );
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
