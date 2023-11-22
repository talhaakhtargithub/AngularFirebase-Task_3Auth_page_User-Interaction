import { Component, OnInit, OnDestroy, Inject } from '@angular/core'; // Import Inject
import { WalletService } from 'src/app/shared/wallet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, OnDestroy {

  balance: number = 0;
  topUpAmount: number = 0;
  withdrawAmount: number = 0;
  private walletSubscription!: Subscription;

  // Use Inject decorator to specify injection token for WalletService
  constructor(@Inject(WalletService) private walletService: WalletService) { }

  ngOnInit(): void {
    this.getWalletBalance();

    // Subscribe to real-time wallet balance updates
    this.walletSubscription = this.walletService.walletUpdates.subscribe(() => {
      this.getWalletBalance();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from wallet updates when the component is destroyed
    this.walletSubscription.unsubscribe();
  }

  getWalletBalance() {
    this.balance = this.walletService.getBalance();
  }

  topUp() {
    this.walletService.topUp(this.topUpAmount);
    this.topUpAmount = 0; // Reset the input field after topping up
  }

  withdraw() {
    this.walletService.withdraw(this.withdrawAmount);
    this.withdrawAmount = 0; // Reset the input field after withdrawing
  }
}
