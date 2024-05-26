import { ComponentFixture, TestBed, TestBedStatic } from '@angular/core/testing';
import { DndFilesDirective } from './dnd-files.directive';
import { By } from "@angular/platform-browser";
import { Component, DebugElement } from '@angular/core';

@Component({
    template: `<div id="dropZone" appDndFiles (fileDropped)="filesHandler($event)"></div>`
})
class TestComponent {
    filesHandler(fileList: FileList) { console.log('lets process the dropped files : ', fileList)}
}

describe('DndFilesDirective', () => {
  let testComponent: TestComponent;
  let dndDirective: DebugElement;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ DndFilesDirective, TestComponent ]
    });
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;

    dndDirective = fixture.debugElement.query(By.directive(DndFilesDirective));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(dndDirective).toBeTruthy();
    expect(testComponent).toBeTruthy();
  });

});
