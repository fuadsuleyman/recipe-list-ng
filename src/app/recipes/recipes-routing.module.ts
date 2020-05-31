import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [
    { path: '',
    component: RecipesComponent,
    // below code is alternative way, but  I use easy way with AuthGuard
    // canActivate: [AutGuardService],
    canActivate: [AuthGuard],
  // below first empty path mean when we dont select any recipe
      children:[
          {path: '', component: RecipeStartComponent},
          { path: 'new', component: RecipeEditComponent },
          // clickRecipeList step1
          { path: ':id', component: RecipeDetailsComponent },
          { path: ':id/edit', component: RecipeEditComponent }
      ]
     }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {}