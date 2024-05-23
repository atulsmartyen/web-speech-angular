import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from './video-player.component';
import { MaterialModule } from '../shared/material/material.module';


@NgModule({
  declarations: [VideoPlayerComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class VideoPlayerModule { }
