import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CategoryComponent } from './category/category.component';
import { TagComponent } from './tag/tag.component';


@NgModule({
  declarations: [
    CategoryComponent,
    TagComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
