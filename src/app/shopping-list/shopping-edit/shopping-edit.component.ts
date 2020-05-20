import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {  } from 'events';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  // I already use reactive form, and dont need local referances
  // @ViewChild ('nameInput', {static: false}) nameInputRef:ElementRef;
  // @ViewChild ('amountInput', {static: false}) amountInputRef:ElementRef;

  subscription: Subscription;
  
  shoppingListForm: FormGroup;

  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(
    private shoppinglistService: ShoppingListService,
    private formBuilder: FormBuilder) { }

    get ingName (){
      return this.shoppingListForm.get('ingName');
    } 

    get ingAmount (){
      return this.shoppingListForm.get('ingAmount');
    }

  ngOnInit(){
    this.shoppingListForm = this.formBuilder.group({
      ingName: ['', [Validators.required]],
      ingAmount: ['', [Validators.required, Validators.pattern("^[1-9]+[0-9]*$")]]
    })

    // in shoppinglist.ts we emit index of clicked
    this.subscription = this.shoppinglistService.startedEditing.
    subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppinglistService.getIngredient(index);
        this.shoppingListForm.setValue({
          ingName: this.editedItem.name,
          ingAmount: this.editedItem.amount
        })
      }
    );
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }



  onAddShoppingListItemSubmit(){
    // const ingName = this.nameInputRef.nativeElement.value;
    // const ingAmount = this.amountInputRef.nativeElement.value;

    console.log(this.shoppingListForm);
    
    const newIngredient = new Ingredient(this.shoppingListForm.value.ingName, this.shoppingListForm.value.ingAmount)
    if(this.editMode){
      this.shoppinglistService.updateIngredient(this.editedItemIndex, newIngredient);
    }else {
      this.shoppinglistService.addIngredient(newIngredient);
    }

    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onClear(){
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.shoppinglistService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }


}
