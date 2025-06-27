import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Router } from '@angular/router';
import { Category, RecipeService } from '../../services/recipe.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-add-recipe',
  imports: [
    CommonModule,
    NzIconModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.css'
})
export class AddRecipeComponent implements OnInit, AfterViewInit {
  recipeForm: FormGroup;
  categories: Category[] = [];
  isMobile = false;

  query: string = '';
  isCseReady = false;

/*   ngAfterViewInit() {
    const cx = 'c056cd0c7ff67463a'; // Replace with your ID
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cse.google.com/cse.js?cx=${cx}`;
    document.body.appendChild(script);
  } */

    ngAfterViewInit(): void {
  const cx = 'c056cd0c7ff67463a'; // ✅ Your CSE ID
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://cse.google.com/cse.js?cx=${cx}`;
  document.body.appendChild(script);

  // ✅ Now hook into YouTube links after CSE loads
  const observer = new MutationObserver(() => {
    const links = document.querySelectorAll('.gsc-webResult a');
    links.forEach(link => {
      const href = (link as HTMLAnchorElement).href;
      if (href.includes('youtube.com') || href.includes('youtu.be')) {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          this.openYouTube(href);
        });
      }
    });
  });

  const searchBox = document.getElementById('search-box');
  if (searchBox) {
    observer.observe(searchBox, { childList: true, subtree: true });
  }
}



  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
  }



  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private recipeService: RecipeService) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      link: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|shorts\/)|youtu\.be\/|facebook\.com\/|fb\.watch\/|instagram\.com\/reel\/).+/
          )
        ]
      ],
      description: [''],
      category: [null, Validators.required]
    });
  }
async ngOnInit() {
  this.checkScreen();
  window.addEventListener('resize', () => this.checkScreen());

  this.route.queryParamMap.subscribe(params => {
    const sharedLink = params.get('sharedLink');
    if (sharedLink) {
      this.recipeForm.patchValue({ link: decodeURIComponent(sharedLink) });
    }
  });

  // 🔐 Wait for user to be signed in
  const userId = await this.recipeService.waitForUserId();
  console.log('Firebase UID ready:', userId);

  this.recipeService.getCategories().subscribe(categories => {
    this.categories = categories;
    console.log('Categories loaded:', categories);

    if (categories.length === 1) {
      this.recipeForm.patchValue({ category: categories[0].id });
    }
  });
}

openYouTube(link: string) {
  localStorage.setItem('returnTo', '/recipe');
  console.log('[CSE] YouTube link clicked:', link);
  window.open(link, '_blank');
}


  onSubmit(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const formValue = this.recipeForm.value;
    const recipePayload = {
      recipeName: formValue.name,
      recipeLink: formValue.link,
      recipeDesc: formValue.description,
      categoryId: formValue.category
    };

    this.recipeService.addRecipe(recipePayload).then(() => {
      console.log('Recipe added successfully', recipePayload);
      this.router.navigate(['/home']);
    }).catch(err => {
      console.error('Error adding recipe:', err);
    });
  }

  onCancel(): void {
    this.recipeForm.reset();
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
