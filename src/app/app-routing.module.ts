import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebSpeechComponent } from './web-speech/web-speech.component';
import { UploadDocComponent } from './upload-doc/upload-doc.component';
import { SearchDocComponent } from './search-doc/search-doc.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

const routes: Routes = [{
    path: '',
    component: SearchDocComponent,
    pathMatch: 'full'
  },{
    path: 'web-speech',
    component: WebSpeechComponent,
    pathMatch: 'full'
  },{
    path: 'search-document/:input',
    component: SearchDocComponent,
    pathMatch: 'full'
  },{
    path: 'search-document',
    component: SearchDocComponent,
    pathMatch: 'full'
  },{
    path: 'upload-document',
    component: UploadDocComponent,
    pathMatch: 'full'
  },{
    path: 'video-player/:accountId/:videoId/:startTime',
    component: VideoPlayerComponent,
    pathMatch: 'full'
  },{
    path: '**',
    redirectTo: ''
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
