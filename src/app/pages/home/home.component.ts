import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterModule } from '@angular/router';
import { OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Category, Recipe, RecipeService } from '../../services/recipe.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit {
  sidebarVisible = false;
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  recipes: Recipe[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private modal: NzModalService,
    private recipeService: RecipeService
  ) { }

ngOnInit() {
  this.seedPredefinedCategories(); // seed categories
  this.loadRecipes();              // load recipes
}

seedPredefinedCategories(): void {
  firstValueFrom(this.recipeService.getCategories()).then(async (userCats) => {
    const userCategoryNames = userCats.map(c => c.name.toLowerCase());
    const predefined = ['Breakfast', 'Lunch', 'Dinner'];

    for (const name of predefined) {
      if (!userCategoryNames.includes(name.toLowerCase())) {
        await this.recipeService.addCategory(name);
      }
    }

    // ✅ After insertions, re-subscribe to fresh list
    this.recipeService.getCategories().subscribe((freshCats) => {
      const allCategory: Category = { id: null, name: 'All', userId: '' };
      this.categories = [allCategory, ...freshCats];
    });
  });
}

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe((data) => {
      this.recipes = data;
      console.log('Loaded recipes:', this.recipes);
    });
  }

  get filteredRecipes() {
    if (!this.selectedCategoryId) return this.recipes;

    return this.recipes.filter(recipe => recipe.categoryId === this.selectedCategoryId);
  }

  onSelectCategory(catId: string | null): void {
    this.selectedCategoryId = catId;
    this.closeMenu();
  }



  getCategoryNameById(id: string): string {
    const category = this.categories.find(cat => cat.id === id);
    return category?.name || 'Unknown';
  }



  onAddCategory(): void {
    const modalRef = this.modal.create({
      nzContent: AddCategoryComponent,
      nzFooter: null
    });

    modalRef.afterClose.subscribe((categoryName: string) => {
      if (categoryName) {
        console.log('Added category:', categoryName);
      }
    });
  }

  onAddRecipeDetails() {
    this.router.navigate(['/recipe'], {
      state: { categories: this.categories }
    });
  }

  openMenu() {
    this.sidebarVisible = true;
  }

  closeMenu() {
    this.sidebarVisible = false;
  }
}



