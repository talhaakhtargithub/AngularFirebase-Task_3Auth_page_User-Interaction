import { Component } from '@angular/core';
import { WalletService } from './wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent {
  topUpAmount!: number;

  constructor(private walletService: WalletService) {}

  topUp() {
    this.walletService.topUp(this.topUpAmount).then(() => {
      console.log('Top-up successful');
    });
  }
}
