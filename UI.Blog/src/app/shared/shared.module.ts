import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';


@NgModule({
  declarations: [
    NotfoundComponent,
    NavBarComponent,
    FooterComponent,
    SkeletonComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
