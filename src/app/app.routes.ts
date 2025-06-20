import { Routes } from '@angular/router';
import { AddRecipeComponent } from './pages/add-recipe/add-recipe.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
    {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'recipe/:name',
      loadComponent: () => import('./pages/recipe-details/recipe-details.component').then(m => m.RecipeDetailsComponent)
  },
  {
    path: 'recipe',
    loadComponent: () => import('./pages/add-recipe/add-recipe.component').then(m => m.AddRecipeComponent)
  },
];
