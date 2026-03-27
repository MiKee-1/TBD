import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { switchMap, map, combineLatest, tap } from 'rxjs';
import { ProductApi } from '../../../core/services/product-api';
import { Product } from '../../../core/models/product';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  templateUrl: './product-detail-page.html',
  styleUrls: ['./product-detail-page.scss'],
  imports: [RouterModule, AsyncPipe, CurrencyPipe, MatCardModule, MatButtonModule, MatSnackBarModule],
})

export class ProductDetailPage {
  private route = inject(ActivatedRoute);
  private svc = inject(ProductApi);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  readonly product$ = this.route.paramMap.pipe(
    map(params => params.get('id') as string),
    switchMap(id => this.svc.getById(id)),
    tap(() => {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
    }),
  );

  navigateToProduct(productId: string) {
    console.log('Navigating to product:', productId);
    this.router.navigate(['/product', productId]).then(() => {
      console.log('Navigation completed');
    });
  }

  readonly similarProducts$ = combineLatest([this.product$, this.svc.listAll()]).pipe(
    map(([currentProduct, allProducts]) => {
      if (!currentProduct.tags || currentProduct.tags.length === 0) {
        return [];
      }

      // Filter products that share at least one tag with the current product
      const similar = allProducts.filter((p: Product) =>
        p.id !== currentProduct.id &&
        p.tags &&
        p.tags.some((tag: string) => currentProduct.tags?.includes(tag))
      );

      // Return up to 3 similar products
      return similar.slice(0, 3);
    })
  );

  onAddToCart(product: Product) {
    // Check stock availability
    if (!product.inStock || product.quantity === 0) {
      this.snackBar.open('Questo prodotto non è disponibile', 'Chiudi', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.cartService.addToCart(product.id).subscribe({
      next: () => {
        this.snackBar.open(`${product.title} aggiunto al carrello`, 'Vai al carrello', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        }).onAction().subscribe(() => {
          // Navigate to cart when "Vai al carrello" is clicked
          this.router.navigate(['/cart']);
        });
      },
      error: (err) => {
        if (err.status === 401) {
          this.snackBar.open('Effettua il login per aggiungere prodotti al carrello', 'Login', {
            duration: 5000
          }).onAction().subscribe(() => {
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: this.router.url }
            });
          });
        } else {
          this.snackBar.open(
            err.error?.error || 'Errore durante l\'aggiunta al carrello',
            'Chiudi',
            {
              duration: 3000,
              panelClass: ['error-snackbar']
            }
          );
        }
      }
    });
  }
}