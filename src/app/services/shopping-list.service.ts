import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  ingredientsChanged = new Subject<Ingredient[]>();

  // whith this subject we pass index from shippinglist to shoppingEdit
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomato', 15),
    new Ingredient('Potato', 20)
  ]
  
  getIngredient(index: number){
    return this.ingredients[index]
  } 

  // slice means we get new copy
  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients:Ingredient[]){
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    // pass to chilcked ingredient new ingredient
    this.ingredients[index] = newIngredient;
    // emit updated ingredients array, for use in other place
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number){
    // delete item from array
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  constructor() { }
}
