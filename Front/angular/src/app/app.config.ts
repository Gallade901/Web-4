import { ApplicationConfig } from '@angular/core';
import {provideRouter, withHashLocation} from '@angular/router'
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation())]
};
