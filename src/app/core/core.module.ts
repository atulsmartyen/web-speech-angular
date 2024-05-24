// core.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.interceptors';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    AuthInterceptor
  ]
})
export class CoreModule { }