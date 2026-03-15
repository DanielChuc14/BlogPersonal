import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { PostsComponent } from './posts/posts.component';
import { PostFormComponent } from './posts/post-form/post-form.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryFormComponent } from './categories/category-form/category-form.component';
import { TagsComponent } from './tags/tags.component';
import { TagFormComponent } from './tags/tag-form/tag-form.component';
import { RolesComponent } from './roles/roles.component';
import { RoleFormComponent } from './roles/role-form/role-form.component';
import { RolePermissionsComponent } from './roles/role-permissions/role-permissions.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { PermissionFormComponent } from './permissions/permission-form/permission-form.component';
import { AuditLogComponent } from './audit-log/audit-log.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'posts/new', component: PostFormComponent },
      { path: 'posts/edit/:id', component: PostFormComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/new', component: CategoryFormComponent },
      { path: 'categories/edit/:id', component: CategoryFormComponent },
      { path: 'tags', component: TagsComponent },
      { path: 'tags/new', component: TagFormComponent },
      { path: 'tags/edit/:id', component: TagFormComponent },
      { path: 'users', component: UserManagerComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'roles/new', component: RoleFormComponent },
      { path: 'roles/edit/:id', component: RoleFormComponent },
      { path: 'roles/:id/permissions', component: RolePermissionsComponent },
      { path: 'permissions', component: PermissionsComponent },
      { path: 'permissions/new', component: PermissionFormComponent },
      { path: 'permissions/edit/:id', component: PermissionFormComponent },
      { path: 'audit', component: AuditLogComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
