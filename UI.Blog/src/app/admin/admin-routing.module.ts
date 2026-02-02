import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { TagComponent } from './tag/tag.component';

const routes: Routes = [
  {
    path:'categories',
    component: CategoryComponent
  },
  {
    path:'tags',
    component: TagComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
