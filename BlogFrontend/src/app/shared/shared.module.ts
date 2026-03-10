import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { BtnComponent } from './components/btn/btn.component';
import { AlertComponent } from './components/alert/alert.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ModalComponent } from './components/modal/modal.component';
import { CrudFormComponent } from './components/crud-form/crud-form.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
    NotificationComponent,
    ConfirmDialogComponent,
    ThemeToggleComponent,
    BtnComponent,
    AlertComponent,
    DataTableComponent,
    ModalComponent,
    CrudFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
    NotificationComponent,
    ConfirmDialogComponent,
    ThemeToggleComponent,
    BtnComponent,
    AlertComponent,
    DataTableComponent,
    ModalComponent,
    CrudFormComponent,
  ]
})
export class SharedModule {}
