import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutsModule } from '../layouts/layouts.module';

// Existing components
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostEditorComponent } from './post-editor/post-editor.component';
import { UserManagerComponent } from './user-manager/user-manager.component';

// Posts
import { PostsComponent } from './posts/posts.component';
import { PostFormComponent } from './posts/post-form/post-form.component';

// Categories
import { CategoriesComponent } from './categories/categories.component';
import { CategoryFormComponent } from './categories/category-form/category-form.component';

// Tags
import { TagsComponent } from './tags/tags.component';
import { TagFormComponent } from './tags/tag-form/tag-form.component';

// Roles
import { RolesComponent } from './roles/roles.component';
import { RoleFormComponent } from './roles/role-form/role-form.component';
import { RolePermissionsComponent } from './roles/role-permissions/role-permissions.component';

// Permissions
import { PermissionsComponent } from './permissions/permissions.component';
import { PermissionFormComponent } from './permissions/permission-form/permission-form.component';

// Audit Log
import { AuditLogComponent } from './audit-log/audit-log.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PostEditorComponent,
    UserManagerComponent,
    PostsComponent,
    PostFormComponent,
    CategoriesComponent,
    CategoryFormComponent,
    TagsComponent,
    TagFormComponent,
    RolesComponent,
    RoleFormComponent,
    RolePermissionsComponent,
    PermissionsComponent,
    PermissionFormComponent,
    AuditLogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    LayoutsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatPaginatorModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}
