import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

if (environment.production) {
  console.log('Production Mode');
  enableProdMode();
}

declare const module: any;
// Enables Hot Module Replacement.
if (environment.hmr) {
    if (module.hot) {
        module.hot.accept();
    }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
