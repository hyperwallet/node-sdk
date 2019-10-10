import { IResourceLink } from './ResourceLink';

export interface IListBankCardsResponse {
  count: number;
  offset: number;
  limit: number;
  data: IListBankCardsResponseCard[];
  links: IResourceLink[];
}

export interface IListBankCardsResponseCard {
  token: string;
  type: 'BANK_CARD';
  status: string;
  createdOn: string;
  transferMethodCountry: string;
  transferMethodCurrency: string;
  cardType: 'DEBIT';
  cardNumber: string;
  cardBrand: string;
  /**
   * Format: YYYY-MM
   */
  dateOfExpiry: string;
  processingTime: string;
  links: IResourceLink[];
}
