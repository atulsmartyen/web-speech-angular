import {
    Directive,
    Output,
    EventEmitter,
    HostBinding,
    HostListener
  } from '@angular/core';

  @Directive({
    selector: '[appDndFiles]'
  })
  export class DndFilesDirective {
    @HostBinding('class.fileover') fileOver: boolean = false;
    @Output() fileDropped = new EventEmitter<FileList>();

    private lastEnter: EventTarget;

    @HostListener('dragenter', ['$event']) onDragEnter(event: DragEvent) {
      this.stopEventPropagation(event);
      this.lastEnter = event.target;
      event.dataTransfer.dropEffect = 'copy';
    }

    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
      this.stopEventPropagation(event);
      event.dataTransfer.dropEffect = 'copy';
      this.fileOver = true;
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
      this.stopEventPropagation(event);
      if (this.lastEnter === event.target) {
        this.fileOver = false;
      }
    }

    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(event: DragEvent) {
      this.stopEventPropagation(event);
      this.fileOver = false;
      let files = event.dataTransfer.files;
      if (files.length > 0) {
        this.fileDropped.emit(files);
      }
    }

    @HostListener('window:dragover', ['$event']) public onDragOverOutside(event: DragEvent) {
      this.stopEventPropagation(event);
      event.dataTransfer.dropEffect = 'none';
      this.fileOver = false;
    }

    @HostListener('window:drop', ['$event']) public onDropOutside(event: DragEvent) {
      this.stopEventPropagation(event);
    }

    private stopEventPropagation(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
    }

  }
