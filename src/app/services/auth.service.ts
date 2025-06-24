import { Injectable } from '@angular/core';
import { Auth, signInAnonymously, User } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 currentUser: User | null = null;

  constructor(private auth: Auth) {
    this.initAuth();
  }

  async initAuth() {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.currentUser = user;
        console.log('Logged in as anonymous user:', user.uid);
      } else {
        this.signIn();
      }
    });
  }

  async signIn() {
    try {
      const userCredential = await signInAnonymously(this.auth);
      this.currentUser = userCredential.user;
      console.log('Signed in anonymously:', this.currentUser.uid);
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
    }
  }

  getUserId(): string | null {
    return this.currentUser?.uid || null;
  }
}
