import { Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';


@Component({
  selector: 'app-add-category',
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
categoryName = '';

  constructor(private modalRef: NzModalRef, private recipeService: RecipeService) {}

  onAdd(): void {
    const name = this.categoryName.trim();
    if (name) {
      this.recipeService.addCategory(name).then(() => {
        this.modalRef.close(name); // pass back to HomeComponent
      });
    }
  }

  onCancel(): void {
    this.modalRef.close(); // just close
  }
}
