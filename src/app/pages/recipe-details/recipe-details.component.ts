import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  imports: [],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent {
  recipeName: string = '';

  constructor(private route: ActivatedRoute) {
    this.recipeName = this.route.snapshot.paramMap.get('name') || 'Unknown';
  }
}
