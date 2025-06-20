import { Injectable } from '@angular/core';
import { collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Category {
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class RecipeService {

  constructor(private firestore: Firestore) {}

async addCategory(name: string): Promise<void> {
  const catRef = collection(this.firestore, 'categories');
  await addDoc(catRef, { name });
}

getCategories(): Observable<Category[]> {
  const catRef = collection(this.firestore, 'categories');
  return collectionData(catRef, { idField: 'id' }) as Observable<Category[]>;
}
}
