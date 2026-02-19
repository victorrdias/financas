import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBVH5HcmFVgw6jriebgqfRSnXKzCtV_D7k',
  authDomain: 'financas-12b51.firebaseapp.com',
  projectId: 'financas-12b51',
  storageBucket: 'financas-12b51.firebasestorage.app',
  messagingSenderId: '123199128451',
  appId: '1:123199128451:web:febf35ca3baaa7aafeacb6',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
