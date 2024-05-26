import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FilesSelectionData} from "./file-selection-data";

@Component({
  selector: 'file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})

export class FileSelectorComponent implements AfterViewInit {
  @Output() onFiles: EventEmitter<FilesSelectionData> = new EventEmitter<FilesSelectionData>();

  @Input() filesInputId: string = 'fileDropRef';
  @Input() supportedFileFormats: string = '';
  @Input() supportedFileFormatsTooltipText: string = '';
  @Input() addFilesDescription: string = 'Click to upload or Drag and drop';
  @Input() buttonText: string = 'Choose File';
  @Input() icon: string = '/assets/Images/cmdAddPart48.svg';
  @Input() isCustomButtonEnable: boolean = false;
  @Input() supportMultipleFilesSelection: boolean = true;
  @Input() fileUploadInProgress: boolean = false;

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

}
