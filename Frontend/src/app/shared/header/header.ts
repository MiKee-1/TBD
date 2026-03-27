import { Component, computed, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [MatIcon, MatToolbar, MatButton, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger, MatBadgeModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  authService = inject(AuthService);
  cartService = inject(CartService);

  currentUser = this.authService.currentUser;
  isLoggedIn = this.authService.isLoggedIn;
  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');

  // Cart badge
  cartItemCount = this.cartService.itemCount;

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  logout(): void {
    this.authService.logout();
    this.cartService.resetCart();
    this.router.navigate(['/products']);
  }
}
