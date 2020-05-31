import { NgModule } from '@angular/core';
import { ShoppingListRoutingModule } from './shopping-list.routing.module';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    ReactiveFormsModule,
    ShoppingListRoutingModule,
    SharedModule,
    RouterModule
  ]
})
export class ShoppingListModule { }