import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Router } from '@angular/router';
import { Category } from '../../services/recipe.service';

@Component({
  standalone: true,
  selector: 'app-add-recipe',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.css'
})
export class AddRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  categories: Category[] = [];
  isMobile = false;

ngOnInit() {
  this.checkScreen();
  window.addEventListener('resize', () => this.checkScreen());
}

checkScreen() {
  this.isMobile = window.innerWidth <= 768;
}


  constructor(private fb: FormBuilder, private router: Router) {
     const nav = this.router.getCurrentNavigation();
  const state = nav?.extras.state as { categories: Category[] };
  this.categories = state?.categories || [];
    console.log('Received categories:', this.categories);
    
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      link: ['', Validators.required],
      description: [''],
      category: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      console.log('Recipe submitted:', this.recipeForm.value);
      // TODO: handle submission (e.g., API call)
    }
  }

  onCancel(): void {
    this.recipeForm.reset();
  }
}
