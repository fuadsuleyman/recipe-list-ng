import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from './recipe.service';
import { map, take, exhaustMap, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService) { }
  
  storeRecipes(){
    const recipes = this.recipeService.getRecipes();

    this.http.put(
      'https://ng-recipe-list-c6e08.firebaseio.com/recipes.json',
      recipes
    )
    .subscribe(response => {
      console.log(response);
      
    })
  }

// pipe & map transform data which ve fetch from api
// second map in below code is array method
// we write lojic it means we want we fetching data always have ingredients array  
fetchRecipes(){
     return this.http.get<Recipe[]>(
      'https://ng-recipe-list-c6e08.firebaseio.com/recipes.json',
    ) 
    .pipe(
    map(recipes => {
      return recipes.map( recipe =>{
        return {...recipe, ingredients: recipe.ingredients? recipe.ingredients : []}
      })
    }),
    tap(recipes => {
      //console.log(recipes);
      this.recipeService.setRecipes(recipes);
    }))
  }

}
 