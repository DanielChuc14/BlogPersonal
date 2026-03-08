import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagService } from '../../core/services/tag.service';
import { Tag } from '../../core/models/tag.model';

@Component({
  selector: 'app-tags',
  standalone: false,
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit {
  tags: Tag[] = [];
  displayedColumns = ['name', 'description', 'actions'];
  loading = false;

  constructor(private tagService: TagService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.tagService.getAll().subscribe({
      next: tags => { this.tags = tags; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  newTag(): void {
    this.router.navigate(['/admin/tags/new']);
  }

  editTag(id: number): void {
    this.router.navigate(['/admin/tags/edit', id]);
  }

  deleteTag(id: number): void {
    if (!confirm('¿Eliminar este tag?')) return;
    this.tagService.delete(id).subscribe(() => this.load());
  }
}
