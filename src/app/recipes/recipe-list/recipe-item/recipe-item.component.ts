import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  // this I get from recipe-list.comp, there i have recipe objects
  @Input() recipe: Recipe;
  
  // clickRecipeList step5
  // here we get index whitch we pass from recipe-list-comp.html
  // we use to pass to url
  @Input() index: number;

  
  ngOnInit(): void {
  }

}
