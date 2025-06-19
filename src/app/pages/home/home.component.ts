import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterModule } from '@angular/router';
import { OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

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
  categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks', 'Dessert'];
  selectedCategory = 'All';

  recipes = [
    { name: 'Pancakes', category: 'Breakfast' },
    { name: 'Omelette', category: 'Breakfast' },
    { name: 'Burger', category: 'Lunch' },
    { name: 'Pasta', category: 'Dinner' },
    { name: 'Fries', category: 'Snacks' },
    { name: 'Lemonade', category: 'Drinks' },
    { name: 'Ice Cream', category: 'Dessert' }
  ];

  get filteredRecipes() {
    return this.selectedCategory === 'All'
      ? this.recipes
      : this.recipes.filter(recipe => recipe.category === this.selectedCategory);
  }

  constructor(@Inject(DOCUMENT) private document: Document,private router: Router) { }

ngOnInit(): void {
  const existingScript = this.document.getElementById('cse-script');
  if (!existingScript) {
    const script = this.document.createElement('script');
    script.id = 'cse-script';
    script.src = 'https://cse.google.com/cse.js?cx=94386f84d0c7346d1';
    script.async = true;

    script.onload = () => {
      this.tryRenderSearchBox();
    };

    this.document.head.appendChild(script);
  } else {
    this.tryRenderSearchBox();
  }
}

private tryRenderSearchBox(attempts = 0) {
  const maxAttempts = 10;

  const interval = setInterval(() => {
    const cse = (window as any).google?.search?.cse?.element;
    const container = this.document.getElementById('cse-search-container');

    if (cse?.render && container) {
      clearInterval(interval);

      cse.render({
        div: 'cse-search-container',
        tag: 'search',
        attributes: {
          enableAutoComplete: true
        }
      });
    }

    if (++attempts >= maxAttempts) {
      clearInterval(interval);
      console.warn('Google CSE failed to load in time.');
    }
  }, 300);
}

  openMenu() {
    this.sidebarVisible = true;
  }

  closeMenu() {
    this.sidebarVisible = false;
  }

  onSelectCategory(cat: string) {
    this.selectedCategory = cat;
    this.closeMenu();
  }

  onAddCategory() {
    const newCategory = prompt('Enter new category name:');
    if (newCategory && !this.categories.includes(newCategory)) {
      this.categories.push(newCategory);
    }
  }
  onAddRecipeDetails() {
    console.log("RecipeAdd")
    this.router.navigate(['/recipe']);
  }
}


