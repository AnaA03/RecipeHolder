import { Injectable } from '@angular/core';
import { Auth, signInAnonymously, User } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 currentUser: User | null = null;
  private _authReadyResolver!: (value: User) => void;
  authReady: Promise<User>;

  constructor(private auth: Auth) {
    // Setup authReady promise
    this.authReady = new Promise(resolve => {
      this._authReadyResolver = resolve;
    });

    this.initAuth();
  }

  async initAuth() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.currentUser = user;
        console.log('User authenticated:', user.uid);
        this._authReadyResolver(user); // ✅ Resolve ready when user is available
      } else {
        try {
          const result = await signInAnonymously(this.auth);
          this.currentUser = result.user;
          console.log('Signed in anonymously:', result.user.uid);
          this._authReadyResolver(result.user); // ✅ Resolve here for first-time users
        } catch (error) {
          console.error('Anonymous sign-in failed:', error);
        }
      }
    });
  }

  getUserId(): string | null {
    return this.currentUser?.uid || null;
  }
}