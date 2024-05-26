import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FilesSelectionData} from "./file-selection-data";

@Component({
  selector: 'file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})

export class FileSelectorComponent implements AfterViewInit {
  @Output() onFiles: EventEmitter<FilesSelectionData> = new EventEmitter<FilesSelectionData>();
  @Output() onCustomButtonClick: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

  @Input() filesInputId: string = 'fileDropRef';
  @Input() supportedFileFormats: string = '';
  @Input() supportedFileFormatsTooltipText: string = '';
  @Input() addFilesDescription: string = 'Add files to create a new order here. Drag & drop or browse';
  @Input() buttonText: string = 'Choose File';
  @Input() icon: string = '/assets/Images/cmdAddPart48.svg';
  @Input() isCustomButtonEnable: boolean = false;
  @Input() supportMultipleFilesSelection: boolean = true;

  @ViewChild('fileDropRef', {static: false}) file: ElementRef;

  ngAfterViewInit() {
    this.handleMultipleFileSelectionSupport();
  }

  private handleMultipleFileSelectionSupport(): void {
    if(!this.supportMultipleFilesSelection && this.file?.nativeElement) {
      this.file.nativeElement.removeAttribute("multiple");
    }
  }

  public filesHandler(files: FileList, isDrag: boolean) {
    if (files && files.length) {
      this.onFiles.emit({files: files, isDrag: isDrag});
    }
  }

  public onCustomButton(): void {
    this.onCustomButtonClick.emit(this.file);
  }

}
