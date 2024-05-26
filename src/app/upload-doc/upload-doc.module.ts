import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocComponent } from './upload-doc.component';
import { MaterialModule } from '../shared/material/material.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [UploadDocComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ]
})
export class UploadDocModule { }
