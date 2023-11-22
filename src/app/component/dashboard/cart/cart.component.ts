import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = [];

  constructor(private data: DataService) {}

  ngOnInit(): void {
    // Subscribe to changes in the cart items
    this.data.getCartProducts().subscribe(cartItems => {
      this.cartProducts = cartItems;
    });
  }
}
