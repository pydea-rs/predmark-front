import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketService } from '../market.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

enum ModalTypesEnum {
  BUY = 'buy',
  SELL = 'sell',
  NONE = 'none',
}

@Component({
  selector: 'app-market-detail',
  templateUrl: './market-detail.component.html',
  styleUrls: ['./market-detail.component.css'],
  imports: [FormsModule, CommonModule],
})
export class MarketDetailComponent implements OnInit {
  selectedOutcomeIndex: number | null = null;
  amount: number = 0;
  isModalOpen: boolean = false;
  modalType: ModalTypesEnum = ModalTypesEnum.NONE;

  market: Record<string, any> = {};
  outcomes: Record<string, Record<string, any>>[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  openModal(outcomeIndex: number, type: string) {
    this.isModalOpen = true;
    this.modalType = type as ModalTypesEnum;
    this.selectedOutcomeIndex = outcomeIndex;
    this.amount = 0;
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalType = ModalTypesEnum.NONE;
    this.selectedOutcomeIndex = null;
  }

  confirmAction() {
    if (
      this.selectedOutcomeIndex === null ||
      this.selectedOutcomeIndex > this.outcomes.length
    )
      return;

    if (this.modalType === ModalTypesEnum.BUY) {
      this.buyOutcome();
    } else if (this.modalType === ModalTypesEnum.SELL) {
      this.sellOutcome();
    }
    switch (this.modalType) {
      case ModalTypesEnum.BUY:
        this.buyOutcome();
        break;
      case ModalTypesEnum.SELL:
        this.sellOutcome();
        break;
    }
    this.closeModal();
  }

  constructor(
    private route: ActivatedRoute,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    const marketId = +this.route.snapshot.paramMap.get('id')!;
    this.marketService.getMarketById(marketId).subscribe(
      (response) => {
        this.market = response.data;
        this.outcomes = this.market?.['outcomeTokens'];
      },
      (error) => {
        console.error('Error loading market', error);
      }
    );
  }

  set success(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 5000);
  }

  set error(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  buyOutcome(): void {
    if (this.selectedOutcomeIndex !== null) {
      this.marketService
        .buyOutcome(this.market['id'], this.amount, this.selectedOutcomeIndex)
        .subscribe(
          (response) => {
            this.success = 'Token Bought.';
          },
          (error) => {
            this.error = 'Failed to buy token: ' + error.message;
          }
        );
    }
  }

  sellOutcome(): void {
    if (this.selectedOutcomeIndex !== null) {
      this.marketService
        .sellOutcome(this.market['id'], this.amount, this.selectedOutcomeIndex)
        .subscribe(
          (response) => {
            this.success = 'Token Sold.';
          },
          (error) => {
            this.error = 'Failed to sell token: ' + error.message;
            console.log(error)
          }
        );
    }
  }
}
