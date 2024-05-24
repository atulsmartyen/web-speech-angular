import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { WebSpeechModule } from './web-speech/web-speech.module';
import { UploadDocModule } from './upload-doc/upload-doc.module';
import { SearchDocModule } from './search-doc/search-doc.module';
import { VideoPlayerModule } from './video-player/video-player.module';
// import { MatIconModule, MatIconRegistry } from '@angular/material';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import guideNotebook from '!!raw-loader!../assets/images/User-Guide-Logo.svg';

import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/services/auth.interceptors';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    WebSpeechModule,
    UploadDocModule,
    SearchDocModule,
    VideoPlayerModule,
    CoreModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // guideNotebook = `../../assets/icons/User-Guide-Logo.svg`;
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('guideNotebook', sanitizer.bypassSecurityTrustHtml(guideNotebook));
  }
}
