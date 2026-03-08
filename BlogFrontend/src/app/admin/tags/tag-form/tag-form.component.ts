import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TagService } from '../../../core/services/tag.service';

@Component({
  selector: 'app-tag-form',
  standalone: false,
  templateUrl: './tag-form.component.html'
})
export class TagFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  tagId?: number;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.tagId = +id;
      this.loading = true;
      this.tagService.getById(this.tagId).subscribe({
        next: tag => {
          this.form.patchValue({ name: tag.name, description: tag.description ?? '' });
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const save$: Observable<any> = this.isEdit && this.tagId
      ? this.tagService.update(this.tagId, this.form.value)
      : this.tagService.create(this.form.value);

    save$.subscribe({
      next: () => { this.saving = false; this.router.navigate(['/admin/tags']); },
      error: () => { this.saving = false; }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/tags']);
  }
}
