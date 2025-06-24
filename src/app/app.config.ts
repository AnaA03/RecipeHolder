import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { hi_IN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import hi from '@angular/common/locales/hi';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';


registerLocaleData(hi);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), provideNzI18n(hi_IN), importProvidersFrom(FormsModule),
      provideAnimationsAsync(),
       provideHttpClient(),
       NzModalService,
       provideFirebaseApp(() => initializeApp(environment.firebase)),
       provideAuth(() => getAuth()),
       provideFirestore(() => getFirestore()),
      provideRouter(routes),]
};

