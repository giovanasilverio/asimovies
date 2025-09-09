import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { UserInterface } from '../interfaces/user-interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  cadastro(name: string, email: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (user) {
          await this.salvarDados(user.uid, { name, email, tipo: 'Usuário' });
          await user.sendEmailVerification();
          await this.auth.signOut();
        }
      })
      .catch(console.error);
  }

  salvarDados(id: string, user: UserInterface) {
    return this.firestore.collection('users').doc(id).set(user, { merge: true });
  }

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then((cred) => {
        if (cred.user?.emailVerified) this.router.navigate(['/home']);
        else alert('Verifique seu e-mail antes de entrar.');
      })
      .catch(console.error);
  }

  async loginComGoogle(): Promise<firebase.User | null> {
    const provider = new firebase.auth.GoogleAuthProvider();

    // use compat direto (mesmo singleton do firebase-init)
    const cred = await firebase.auth().signInWithPopup(provider);

    if (cred.user) {
      const doc = this.firestore.collection('users').doc(cred.user.uid);
      const snap = await doc.ref.get();
      if (!snap.exists) {
        await this.salvarDados(cred.user.uid, {
          name: cred.user.displayName ?? '',
          email: cred.user.email ?? '',
          tipo: 'Usuário'
        });
      }
    }
    return cred.user;
  }

  async loginComGoogleRedirect() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithRedirect(provider);
  }

  async resolverRedirect() {
    return firebase.auth().getRedirectResult();
  }

  redefinirSenha(email: string) {
    this.auth.sendPasswordResetEmail(email).catch(console.error);
  }

  logout() {
    this.auth.signOut().then(() => this.router.navigate(['/'])).catch(console.error);
  }

  getUserData(): Observable<any> {
    return this.auth.authState.pipe(
      switchMap(user =>
        user ? this.firestore.collection('users').doc(user.uid).valueChanges() : of(null)
      )
    );
  }
}
