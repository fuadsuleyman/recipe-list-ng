import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe('Sebzi Plov',
      'Duyuden hazirlanir, adama lezzet edir',
      'https://www.crunchycreamysweet.com/wp-content/uploads/2018/06/easy-grilled-chicken-salad-1-500x500.jpg',
      [new Ingredient('Duyu', 5), new Ingredient('Sebzi', 10)]),
    new Recipe('Basdirma',
      'Quzu etinden hazirlanir',
      'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2017/06/under-300-calories-cod-cucumber-avocado-mango-salsa-salad.jpg',
      [new Ingredient('Quzu eti', 2), new Ingredient('Nar', 3)])
  ]

  // we get ingredients from recipe.items, and now pass to shoppinglist
  constructor(private shoppinglistService: ShoppingListService) { }

  // slice means we get new copy
  getRecipes() {
    return this.recipes.slice();
  }

  // clickRecipeList step2
  // method for take one recipe
  getRecipe(index: number) {
    return this.recipes[index];
  }

  // I call this method in recipe-detail comp. and get recipe.ingredients 
  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppinglistService.addIngredients(ingredients);
  }
  
  // we use this method in recipe.edit component
  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice())
  }

  // we use this method in recipe.edit component
  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice())
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  

}
