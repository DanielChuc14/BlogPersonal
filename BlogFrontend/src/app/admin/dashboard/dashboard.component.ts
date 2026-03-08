import { Component, OnInit } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { CategoryService } from '../../core/services/category.service';
import { TagService } from '../../core/services/tag.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalPosts = 0;
  totalCategories = 0;
  totalTags = 0;
  publishedPosts = 0;

  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.postService.getAll().subscribe(posts => {
      this.totalPosts = posts.length;
      this.publishedPosts = posts.filter((p: any) => p.status === 1).length;
    });
    this.categoryService.getAll().subscribe(cats => this.totalCategories = cats.length);
    this.tagService.getAll().subscribe(tags => this.totalTags = tags.length);
  }
}
