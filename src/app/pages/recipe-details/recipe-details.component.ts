import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgIf } from '@angular/common';
import { Recipe, RecipeService } from '../../services/recipe.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-recipe-details',
  imports: [NzCardModule, NzButtonModule, NzIconModule,NgIf],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  recipe: Recipe | null = null;
  embedUrl: SafeResourceUrl | null = null;

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

ngOnInit(): void {
  const recipeId = this.route.snapshot.paramMap.get('id');
  if (recipeId) {
    this.recipeService.getRecipeById(recipeId).subscribe((data) => {
      this.recipe = data;
      console.log("recipe whole data....",this.recipe);
      this.embedUrl = this.getEmbedUrl(this.recipe.recipeLink);
      console.log("embadeddd...",this.embedUrl);
    });
  }
}

  getEmbedUrl(originalUrl: string): SafeResourceUrl | null {
  try {
    const url = new URL(originalUrl);
    const hostname = url.hostname;
    let embedUrl: string | null = null;

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId: string | null = null;
      let startTime: string | null = null;

      if (hostname.includes('youtu.be')) {
        videoId = url.pathname.slice(1);
        startTime = url.searchParams.get('t');
      } else if (hostname.includes('youtube.com')) {
        if (url.pathname.startsWith('/watch')) {
          videoId = url.searchParams.get('v');
          startTime = url.searchParams.get('t');
        } else if (url.pathname.startsWith('/shorts/')) {
          videoId = url.pathname.split('/shorts/')[1]?.split('/')[0];
        } else if (url.pathname.startsWith('/embed/') || url.pathname.startsWith('/v/')) {
          videoId = url.pathname.split('/')[2];
        }
      }

      if (!videoId) return null;

      embedUrl = `https://www.youtube.com/embed/${videoId}`;
      if (startTime) {
        const seconds = startTime.replace(/[^0-9]/g, '');
        if (seconds) {
          embedUrl += `?start=${seconds}`;
        }
      }

    } else if (hostname.includes('facebook.com')) {
      embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(originalUrl)}&show_text=false&width=734`;

    } else if (hostname.includes('instagram.com')) {
      const segments = url.pathname.split('/');
      if (segments.length > 2) {
        embedUrl = `https://www.instagram.com/p/${segments[2]}/embed`;
      }
    }

    return embedUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl) : null;
  } catch (err) {
    console.warn('Invalid video URL:', originalUrl);
    return null;
  }
}

extractVideoId(url: string): string {
  const regExp = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : '';
}

onRemove(): void {
  if (this.recipe?.id) {
    this.recipeService.deleteRecipe(this.recipe.id).then(() => {
      this.router.navigate(['/home']); // Redirect after delete
    }).catch(err => {
      console.error('Error deleting recipe:', err);
    });
  }
}
}
