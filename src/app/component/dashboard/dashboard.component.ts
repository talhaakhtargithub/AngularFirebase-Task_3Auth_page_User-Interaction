import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  productList: Product[] = [];
  productObj: Product = {
    id: '',
    product_name: '',
    image_url: '',
    email: '',
    price: 0
  };

  alertMessage!: string;

  constructor(
    private auth: AuthService,
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFireDatabase // Inject AngularFireDatabase
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.listenForAlerts();
  }

  getAllProducts() {
    this.data.getAllProducts().subscribe(
      (res) => {
        this.productList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err) => {
        alert('Error while fetching product data');
      }
    );
  }

  resetForm() {
    this.productObj = {
      id: '',
      product_name: '',
      image_url: '',
      email: '',
      price: 0
    };
  }

  addProduct() {
    // Check if any required property of productObj is an empty string
    if (
      !this.productObj.product_name ||
      !this.productObj.image_url ||
      !this.productObj.email ||
      !this.productObj.price
    ) {
      alert('Fill all input fields');
      return;
    }

    this.data.addProduct(this.productObj);

    // Notify Firebase about the new product
    this.db.object('/alerts').set({ message: 'A new product has been added & the table is refreshed' });

    this.resetForm();
  }

  updateProduct() {
    if (this.productObj.id) {
      this.data.updateProduct(this.productObj);

      // Notify Firebase about the product update
      this.db.object('/alerts').set({ message: 'A product has been updated & the table is refreshed' });

      this.resetForm();
    } else {
      alert('Select a product to update');
    }
  }

  deleteProduct(product: Product) {
    if (window.confirm('Are you sure you want to delete ' + product.product_name + ' ' + product.image_url + ' ?')) {
      this.data.deleteProduct(product);
    }
  }

  onEditProduct(product: Product) {
    this.productObj = { ...product }; // Copy the properties to the form model
  }

  listenForAlerts() {
    const alertsRef = this.db.object('/alerts');

    // Listen for changes in the /alerts node
    alertsRef.valueChanges().subscribe((alert: any) => {
      this.alertMessage = alert.message;
    });

    // Periodically check for stored alerts on other pages
    setInterval(() => {
      // Display the stored alert and clear the session storage
      const storedAlert = sessionStorage.getItem('storedAlert');
      if (storedAlert) {
        this.alertMessage = storedAlert;
        sessionStorage.removeItem('storedAlert');
      }
    }, 1000); // Adjust the interval as needed
  }
}
