import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchItem, SearchVideoItem, SearchService } from './services/search.service';
import { Observable, of } from 'rxjs';
import { first, map, take } from 'rxjs/operators';

@Component({
  selector: 'search-doc',
  templateUrl: './search-doc.component.html',
  styleUrls: ['./search-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDocComponent implements OnInit {
  panelOpenState = true;
  searchText: string = '';
  searchedItems: Observable<any[] | undefined>;
  searchedVideoItems: Observable<any[] | undefined>;

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
    this.searchedItems = this.searchItemsBasedOnPrompt(this.searchText)
    .pipe(
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

        const groupedItems = data.fileName ? [{...data}].map((item:any) => {
          return {
            title: item.fileName,
            subtitle: `${10/parseInt(item.metadata)}`,
            description: `${item.data}`
          }
        }) : [];
  
        console.log('groupedItems:', groupedItems);
        if(!groupedItems) { return [] }
        // Convert the object back to an array
        return Object.values(groupedItems);
      })
    );

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
