import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-market-detail',
  templateUrl: './market-detail.component.html',
  styleUrls: ['./market-detail.component.css'],
})
export class MarketDetailComponent implements OnInit {
  market: any;
  selectedOutcomeIndex: number | null = null;
  amount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    const marketId = +this.route.snapshot.paramMap.get('id')!;
    this.marketService.getMarketById(marketId).subscribe(
      (response) => {
        this.market = response.data;
      },
      (error) => {
        console.error('Error loading market', error);
      }
    );
  }

  buyOutcome(): void {
    if (this.selectedOutcomeIndex !== null) {
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.marketService
        .buyOutcome(this.market.id, this.amount, this.selectedOutcomeIndex)
        .subscribe(
          (response) => {
            console.log('Purchase successful:', response);
          },
          (error) => {
            console.error('Error buying outcome:', error);
          }
        );
    }
  }

  sellOutcome(): void {
    if (this.selectedOutcomeIndex !== null) {
      this.marketService
        .sellOutcome(this.market.id, this.amount, this.selectedOutcomeIndex)
        .subscribe(
          (response) => {
            console.log('Sell successful:', response);
          },
          (error) => {
            console.error('Error selling outcome:', error);
          }
        );
    }
  }
}
