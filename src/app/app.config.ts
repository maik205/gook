import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({ "projectId": "gook-project", "appId": "1:71750459155:web:0dad5c8673eb2d8d1304e6", "storageBucket": "gook-project.appspot.com", "apiKey": "AIzaSyAMLnco6xLBqz5Jgj7VOtV4GBi0--MZ-D8", "authDomain": "gook-project.firebaseapp.com", "messagingSenderId": "71750459155", "measurementId": "G-RK4LX1FWHL" })), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())]
};
