import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  
  subscription: Subscription;
  
  recipes: Recipe[];
  // move to service
  // recipes: Recipe[] = [
  //     new Recipe('Sebzi Plov', 'Duyuden hazirlanir, adama lezzet edir', 'https://www.crunchycreamysweet.com/wp-content/uploads/2018/06/easy-grilled-chicken-salad-1-500x500.jpg'),
  //     new Recipe('Basdirma', 'Quzu etinden hazirlanir', 'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2017/06/under-300-calories-cod-cucumber-avocado-mango-salsa-salad.jpg')
  // ]
  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute) { }

  // NewRecipeButton step2
  // below with relativeTo we get our current url, in this case /recipes and add new
  // and in screen we see recipe-edit
  onNewRecipe(){
    this.router.navigate(['new'], { relativeTo: this.route});
  }
  
  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged
    .subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    )
    this.recipes=this.recipeService.getRecipes();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
