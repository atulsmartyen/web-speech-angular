import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AplFileSelectorComponent } from './apl-file-selector.component';
import {By} from "@angular/platform-browser";

describe('AplFileSelectorComponent', () => {
  let component: AplFileSelectorComponent;
  let fixture: ComponentFixture<AplFileSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ AplFileSelectorComponent ]
    });
    fixture = TestBed.createComponent(AplFileSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call filesHandler on file input change', () => {
    const filesHandlerSpy = spyOn(component, 'filesHandler');
    const fileSelector = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();

    //Create FileList
    const blob = new Blob([""], { type: "text/html" });
    blob["lastModifiedDate"] = "";
    blob["name"] = "filename";
    const file = <File>blob;
    const fileList = {
      0: file,
      1: file,
      length: 2,
      item: (index: number) => file
    };

    fileSelector.triggerEventHandler('change', fileList);
    expect(filesHandlerSpy).toHaveBeenCalled();
  });

});
