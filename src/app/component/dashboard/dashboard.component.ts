import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { WalletService } from 'src/app/shared/wallet.service'; // Import the WalletService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  productList: Product[] = [];
  productObj: Product = {
    id: '',
    product_name: '',
    image_url: '',
    email: '',
    price: 0
  };
  private productSubscription!: Subscription;

  constructor(
    private auth: AuthService,
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private walletService: WalletService // Inject the WalletService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();

    // Subscribe to real-time product updates
    this.productSubscription = this.data.productUpdates.subscribe(() => {
      this.getAllProducts();
      this.notifyUser('Custom message for notification.');

    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from product updates when the component is destroyed
    this.productSubscription.unsubscribe();
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
    if (
      !this.productObj.product_name ||
      !this.productObj.image_url ||
      !this.productObj.email ||
      !this.productObj.price
    ) {
      alert('Fill all input fields');
      return;
    }

    // Add the product without wallet logic
    this.data.addProduct(this.productObj);
    this.resetForm();
  }
  updateProduct() {
    if (this.productObj.id) {
      this.data.updateProduct(this.productObj);
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
    this.productObj = { ...product };
  }






  addToCart(product: Product) {
    const productPrice = product.price;

    // Check if the user has sufficient funds in the wallet
    if (this.walletService.makePurchase(productPrice)) {
      // Deduct the amount from the wallet and add the product to the cart
      this.data.addToCart(product);
      this.notifyUser('Product added to cart successfully.');
    } else {
      alert('Insufficient funds in the wallet');
    }
  }


  // ... (remaining code)
  notifyUser(message: string) {
    const isDashboardPage = this.router.url === '/dashboard';
    const notificationMessage = isDashboardPage
      ? message + ' The table is refreshed.'
      : message + ' Kindly check the dashboard page.';
    alert(notificationMessage);
  }


}
