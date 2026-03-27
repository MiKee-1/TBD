import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatCardModule, MatButtonModule, RouterModule],
  standalone: true,
  templateUrl: `./product-card.html`,
  styleUrls: [`./product-card.scss`],
})

export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Output() add = new EventEmitter<Product>();
  addToCart(p: Product) {
    this.add.emit(p);
  }

  getDiscountPercentage(): number {
    if (this.product.originalPrice && this.product.price && this.product.originalPrice > this.product.price) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  }
}
