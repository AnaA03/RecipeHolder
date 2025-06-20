import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterModule } from '@angular/router';
import { OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Category, RecipeService } from '../../services/recipe.service';

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
  selectedCategory: string | null = 'All';

  // Predefined categories
  predefinedCategories: Category[] = [
    { name: 'All' },
    { name: 'Breakfast' },
    { name: 'Lunch' }
  ];

  recipes = [
    { name: 'Pancakes', category: 'Breakfast' },
    { name: 'Omelette', category: 'Breakfast' },
    { name: 'Burger', category: 'Lunch' },
    { name: 'Pasta', category: 'Dinner' },
    { name: 'Fries', category: 'Snacks' },
    { name: 'Lemonade', category: 'Drinks' },
    { name: 'Ice Cream', category: 'Dessert' }
  ];

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router,
    private modal: NzModalService,
    private recipeService: RecipeService) { }

  ngOnInit() {
    this.loadCategories();

  }
  get filteredRecipes() {
    if (!this.selectedCategory || this.selectedCategory === 'All') {
      return this.recipes;
    }
    return this.recipes.filter(recipe => recipe.category === this.selectedCategory);
  }

  loadCategories(): void {
    this.recipeService.getCategories().subscribe((cats) => {
      // Filter out duplicates (if user already added "Breakfast" etc. in Firestore)
      const dynamicCats = cats.filter(cat =>
        !this.predefinedCategories.some(pre => pre.name === cat.name)
      );
      this.categories = [...this.predefinedCategories, ...dynamicCats];
    });
  }

  openMenu() {
    this.sidebarVisible = true;
  }

  closeMenu() {
    this.sidebarVisible = false;
  }

  onSelectCategory(cat: string | null): void {
    this.selectedCategory = cat;
    console.log('Selected category:', cat);
    this.closeMenu();
  }

  onAddCategory(): void {
    const modalRef = this.modal.create({
      /* nzTitle: 'Add Category', */
      nzContent: AddCategoryComponent,
      nzFooter: null
    });

    modalRef.afterClose.subscribe((categoryName: string) => {
      if (categoryName) {
        console.log('Added category:', categoryName);
        // Firestore auto-sync handles refresh
      }
    });
  }

  onAddRecipeDetails() {
    console.log("RecipeAdd")
    this.router.navigate(['/recipe'], {
      state: {
        categories: this.categories
      }
    });
  }
}


