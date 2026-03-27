import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface ProductFilters {
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc';
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) { }

  list(filters?: ProductFilters): Observable<PaginatedProducts> {
    let params = new HttpParams();

    if (filters) {
      if (filters.title) {
        params = params.set('title', filters.title);
      }
      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        params = params.set('min_price', filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        params = params.set('max_price', filters.maxPrice.toString());
      }
      if (filters.sort) {
        params = params.set('sort', filters.sort);
      }
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.limit !== undefined) {
        params = params.set('limit', filters.limit.toString());
      }
    }

    return this.http.get<PaginatedProducts>(`${this.baseUrl}/products`, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  listAll(filters?: Omit<ProductFilters, 'page' | 'limit'>): Observable<Product[]> {
    return this.list({ ...filters, limit: 10000 }).pipe(
      map(response => response.products)
    );
  }
}