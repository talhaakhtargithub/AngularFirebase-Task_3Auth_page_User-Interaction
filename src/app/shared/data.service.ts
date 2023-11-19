import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from "../model/product"

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs : AngularFirestore, private fireStorage : AngularFireStorage) { }


  // add student
  addProduct(product : Product) {
    product.id = this.afs.createId();
    return this.afs.collection('/Products').add(product);
  }

  // get all Products
  getAllProducts() {
    return this.afs.collection('/Products').snapshotChanges();
  }

  // delete student
  deleteProduct(product : Product) {
     this.afs.doc('/Products/'+product.id).delete();
  }

  // update student
  updateProduct(product : Product) {
    this.deleteProduct(product);
    this.addProduct(product);
  }

  // edit student



}
