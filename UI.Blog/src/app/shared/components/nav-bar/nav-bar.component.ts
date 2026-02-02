import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  showDropdownMenu = false;
  showMenu = false;
  toggleNavbar(){
    this.showDropdownMenu = !this.showDropdownMenu;
  }
  toggleMenu(){
    this.showMenu = !this.showMenu;
  }
}
