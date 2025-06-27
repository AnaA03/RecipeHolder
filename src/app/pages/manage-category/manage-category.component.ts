import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterModule } from '@angular/router';
import { Category, RecipeService } from '../../services/recipe.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-category',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    NzButtonModule,
    NzIconModule,
    NzListModule, NzTypographyModule,
    NzDropDownModule,
    NzModalModule
  ],
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.css'
})
export class ManageCategoryComponent implements OnInit {
  categories: Category[] = [];
  isRenameModalVisible = false;
  renameValue: string = '';
  categoryToRename: Category | null = null;

  isDeleteModalVisible = false;
  categoryToDelete: Category | null = null;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private modal: NzModalService
  ) { }
  ngOnInit(): void {
    this.recipeService.getCategories().subscribe(data => {
      this.categories = data;
      console.log(this.categories);
    });
    const userLang = navigator.language;
console.log(userLang); // Might print 'hi-IN' in WebView
console.log('Language:', navigator.language);
console.log('Modal content:', this.isDeleteModalVisible, this.isRenameModalVisible);

  }
  goBack(): void {
    this.router.navigate(['/home']);
  }

openRenameModal(category: Category): void {
  this.categoryToRename = category;
  this.renameValue = category.name;
  this.isRenameModalVisible = true;
}

handleRenameCancel(): void {
  this.isRenameModalVisible = false;
  this.renameValue = '';
  this.categoryToRename = null;
}

handleRenameOk(): void {
  const newName = this.renameValue.trim();
  if (newName && this.categoryToRename?.id) {
    this.recipeService.renameCategory(this.categoryToRename.id, newName)
      .then(() => {
        this.isRenameModalVisible = false;
        this.renameValue = '';
        this.categoryToRename = null;
      });
  }
}

openDeleteModal(category: Category): void {
  this.categoryToDelete = category;
  this.isDeleteModalVisible = true;
}

handleDeleteCancel(): void {
  this.isDeleteModalVisible = false;
  this.categoryToDelete = null;
}

handleDeleteConfirm(): void {
  if (this.categoryToDelete?.id) {
    this.recipeService.deleteCategory(this.categoryToDelete.id)
      .then(() => {
        this.isDeleteModalVisible = false;
        this.categoryToDelete = null;
      })
      .catch(error => console.error('Delete failed:', error));
  }
}

}

