// wallet.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  getUserWallet(): Observable<any> {
    const userId = this.auth.currentUser?.uid;
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  topUp(amount: number): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    const userRef = this.firestore.collection('users').doc(userId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const currentBalance = userDoc.data().balance || 0;
      const newBalance = currentBalance + amount;
      transaction.update(userRef, { balance: newBalance });
    });
  }

  withdraw(amount: number): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    const userRef = this.firestore.collection('users').doc(userId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const currentBalance = userDoc.data().balance || 0;

      if (amount <= currentBalance) {
        const newBalance = currentBalance - amount;
        transaction.update(userRef, { balance: newBalance });
      } else {
        // Handle insufficient balance
        // You can throw an error or handle it based on your application's requirements
      }
    });
  }
}
