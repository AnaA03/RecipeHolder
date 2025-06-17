import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
import { OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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

  constructor(@Inject(DOCUMENT) private document: Document) { }

ngOnInit(): void {
  if (!this.document.getElementById('cse-script')) {
    const script = this.document.createElement('script');
    script.id = 'cse-script';
    script.src = 'https://cse.google.com/cse.js?cx=94386f84d0c7346d1';
    script.async = true;

    script.onload = () => {
      const interval = setInterval(() => {
        const cse = (window as any).google?.search?.cse?.element;
        if (cse && cse.render) {
          clearInterval(interval);
          cse.render({
            div: "cse-search-container",
            tag: "search",
            attributes: {
              enableAutoComplete: true
              // Add more if needed
            }
          });

          // Set placeholder text manually
/*           setTimeout(() => {
            const input = this.document.querySelector('input.gsc-input') as HTMLInputElement;
            if (input) input.placeholder = 'Search recipes';
          }, 500); */
        }
      }, 200);
    };

    this.document.head.appendChild(script);
  }
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
}
