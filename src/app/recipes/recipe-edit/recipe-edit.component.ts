import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipeListForm: FormGroup;

  get recName(){
    return this.recipeListForm.get('recName');
  }

  get recImgPath(){
    return this.recipeListForm.get('recImgPath');
  }

  get recDesc(){
    return this.recipeListForm.get('recDesc');
  }

  get recIngredients(){
    return this.recipeListForm.get('recIngredients') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private recipeService: RecipeService,
    private router: Router) { }

  // we retrive /fetch params from url and assign to this id
  id: number;
  editMode = false;

  
  ngOnInit() {
      // retrive /fetch params from url
    // below we check if in url our id dont equal to null, editMode be true
    this.route.params
    .subscribe((params:Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    })
  }

  private initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDesc = '';
    let recipeIingredients = new FormArray([]);

    // here we say if we are in editMode take values from recipe.service
    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDesc = recipe.description;
      if(recipe['ingredients']){
        for (let ingredient of recipe.ingredients){
          recipeIingredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern("^[1-9]+[0-9]*$")])
            })
          )
        }
      }
    }
    this.recipeListForm = this.formBuilder.group({
      recName: [recipeName, Validators.required],
      recImgPath: [recipeImagePath, Validators.required],
      recDesc: [recipeDesc, Validators.required],
      recIngredients: recipeIingredients
      })
  }

  // we only add empty form for addding new array
  onAddIngredient(){
    (<FormArray>this.recipeListForm.get('recIngredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
      })
    )
  }
  
  onRecipeListSubmit(){
    console.log(this.recipeListForm);
    const newRecipe = new Recipe(
      this.recipeListForm.value['recName'],
      this.recipeListForm.value['recDesc'],
      this.recipeListForm.value['recImgPath'],
      this.recipeListForm.value['recIngredients']
    )
    if(this.editMode){
      this.recipeService.updateRecipe(this.id, newRecipe);
    }else{
      this.recipeService.addRecipe(newRecipe);
    }
    this.onCancel();
  }

  onCancel(){
    // navigate one upper url from where we are now
    this.router.navigate(['../'], {relativeTo: this.route})
}

onDeleteIngredients(index: number){
  this.recIngredients.removeAt(index);
}

}
