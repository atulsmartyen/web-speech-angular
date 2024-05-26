import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { ModalHelpComponent } from './components/modal-help/modal-help.component';
import { DndFilesDirective } from './components/dnd-files/dnd-files.directive';
import { FileSelectorComponent } from './components/file-selector/file-selector.component';

@NgModule({
  declarations: [ModalHelpComponent, DndFilesDirective, FileSelectorComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    ModalHelpComponent,
    DndFilesDirective,
    FileSelectorComponent
  ]
})
export class SharedModule { }
