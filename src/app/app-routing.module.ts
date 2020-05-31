import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

// import { ScannerComponent } from './scanner/scanner.component';

// path ** it is wildcart, always shuld be last path
// firts path redirect us to recipes page when we open app, but there we have authGuard
// if we don't write firs page, we go to page-not-found page 
const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {
    path: 'recipes',
    loadChildren: () =>
    import('./recipes/recipe.module').then(m => m.RecipeModule)
  },
  {
    path: 'auth',
    loadChildren: () =>
    import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
    import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
  },
  { path: '**', component: PageNotFoundComponent},
  
];

@NgModule({
  // preload is cool, when we auth to app, recipes and shopping-list page aldeary loaded for us
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}

// export const routingComponents = [
//     RecipesComponent,
//     ShoppingListComponent,
//     RecipeStartComponent,
//     RecipeDetailsComponent,
//     RecipeEditComponent,
//     PageNotFoundComponent
//   ];
