import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  where,
  docData
} from '@angular/fire/firestore';
import { doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DeviceIdService } from './device-id.service';
import { getDocs } from '@angular/fire/firestore';

export interface Category {
  id: string | null;
  name: string;
  userId: string;
}

export interface Recipe {
  id?: string;
  recipeName: string;
  recipeLink: string;
  recipeDesc: string;
  categoryId: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(
    private firestore: Firestore,
    private deviceIdService: DeviceIdService
  ) { }

  // Category Methods
  async addCategory(name: string): Promise<void> {
    const userId = this.deviceIdService.getDeviceId();
    const catRef = collection(this.firestore, 'categories');

    // 🔍 Case-insensitive duplicate check
    const q = query(catRef, where('userId', '==', userId), where('name', '==', name));
    const existingSnap = await getDocs(q); // ✅ Wait for result

    if (!existingSnap.empty) {
      console.log(`Category "${name}" already exists. Skipping insert.`);
      return;
    }

    await addDoc(catRef, { name, userId });
  }

  getCategories(): Observable<Category[]> {
    const userId = this.deviceIdService.getDeviceId();
    const catRef = collection(this.firestore, 'categories');
    const q = query(catRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Category[]>;
  }

  deleteCategory(id: string) {
    const docRef = doc(this.firestore, 'categories', id);
    return deleteDoc(docRef);
  }

  renameCategory(id: string, newName: string) {
    const docRef = doc(this.firestore, 'categories', id);
    return updateDoc(docRef, { name: newName });
  }

  // 🔹 Recipe Methods
  async addRecipe(recipe: {
    recipeName: string;
    recipeLink: string;
    recipeDesc: string;
    categoryId: string;
  }): Promise<void> {
    const userId = this.deviceIdService.getDeviceId();
    const recipeRef = collection(this.firestore, 'recipes');
    await addDoc(recipeRef, { ...recipe, userId });
  }

  getRecipes(): Observable<Recipe[]> {
    const userId = this.deviceIdService.getDeviceId();
    const recipeRef = collection(this.firestore, 'recipes');
    const q = query(recipeRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Recipe[]>;
  }

  getRecipeById(id: string): Observable<Recipe> {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return docData(recipeDoc, { idField: 'id' }) as Observable<Recipe>;
  }

  deleteRecipe(id: string) {
  const recipeDoc = doc(this.firestore, 'recipes', id);
  return deleteDoc(recipeDoc);
}
}
