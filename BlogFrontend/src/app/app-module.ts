import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    CoreModule,
    AuthModule,
    AppRoutingModule  // must be last so auth routes register before wildcard
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync()
  ],
  bootstrap: [App]
})
export class AppModule {}
