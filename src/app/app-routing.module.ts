import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeDetailsComponent } from './recipes/recipe-details/recipe-details.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// path ** olan wildCart adlanir, hemise en sonuncu olmalidi
// en yuxaridaki setr, sehife acilan kimi departments sehifesine yoneldir
// eger birinci setri vermesek, page-not-found sehifesine yoneldecek 
const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full'},
  { path: 'recipes', component: RecipesComponent,
// below first empty path mean when we dont select any recipe
    children:[
        {path: '', component: RecipeStartComponent},
        { path: 'new', component: RecipeEditComponent },
        // clickRecipeList step1
        { path: ':id', component: RecipeDetailsComponent },
        { path: ':id/edit', component: RecipeEditComponent }
    ] },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
    RecipesComponent,
    ShoppingListComponent,
    RecipeStartComponent,
    RecipeDetailsComponent,
    RecipeEditComponent,
    PageNotFoundComponent
  ];
