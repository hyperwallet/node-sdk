import { ResourceLink } from "./ResourceLink";

export interface ListBankCardsResponse {
  count: number;
  offset: number;
  limit: number;
  data: ListBankCardsResponseCard[];
  links: ResourceLink[];
}

export interface ListBankCardsResponseCard {
  token: string;
  type: "BANK_CARD";
  status: string;
  createdOn: string;
  transferMethodCountry: string;
  transferMethodCurrency: string;
  cardType: "DEBIT";
  cardNumber: string;
  cardBrand: string;
  /**
   * Format: YYYY-MM
   */
  dateOfExpiry: string;
  processingTime: string;
  links: ResourceLink[];
}
