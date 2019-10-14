import { TransferMethod } from '../types/enums';

export interface IAddTransferMethodResponseBase {
  token: string;
  type: TransferMethod;
  status: 'ACTIVATED' | 'VERIFIED' | 'INVALID' | 'DE_ACTIVATED';
  /**
   * Format: '2019-09-11T13:43:21'
   */
  createdOn: string;
  /**
   * Two-letter country code
   */
  transferMethodCountry: string;
  transferMethodCurrency: string;
  bankName: string;
}

export interface IAddTransferMethodResponse<T extends TransferMethod.BANK_CARD>
  extends IAddTransferMethodResponseBase {
  type: T;
  cardType: 'DEBIT';
  /**
   * Format: ************9999
   */
  cardNumber: string;
  cardBrand: 'VISA' | 'MASTERCARD';
  /**
   * Format: YYYY-MM
   */
  dateOfExpiry: string;
  processingTime: string;
}
