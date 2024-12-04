import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private apiUrl = 'http://localhost:3000/api';  // Change to your backend URL

  constructor(private http: HttpClient) {}

  getMarkets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prediction-market`);
  }

  getMarketById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prediction-market/${id}`);
  }

  buyOutcome(marketId: number, amount: number, outcomeIndex: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/prediction-market/ctf/buy`, { marketId, amount, outcomeIndex });
  }

  sellOutcome(marketId: number, amount: number, outcomeIndex: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/prediction-market/ctf/sell`, { marketId, amount, outcomeIndex });
  }
}
