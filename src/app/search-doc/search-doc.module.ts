import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchDocComponent } from './search-doc.component';
import { VideoItemComponent } from '../video-item/video-item.component';
import { MaterialModule } from '../shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { SearchService } from './services/search.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [SearchDocComponent, VideoItemComponent],
  providers: [SearchService],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    HttpClientModule
  ]
})
export class SearchDocModule { }
