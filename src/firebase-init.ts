import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from './environments/environment';

if (!firebase.apps.length) {
  firebase.initializeApp(environment.firebase);
  console.log('Firebase init OK', firebase.app().options);
}
