import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'book',
    loadComponent: () => import('./book-view/book-view.component').then(m => m.BookViewComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
