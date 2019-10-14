import { TransferMethod } from '../types/enums';

export interface IAddTransferMethodPayload {
  /**
   * Two-letter code
   */
  transferMethodCountry: string;
  /**
   * Three-letter code
   */
  transferMethodCurrency: string;

  type: TransferMethod;

  cardNumber: string;
  /**
   * Format: YYYY-MM
   */
  dateOfExpiry: string;
  cvv: string;
}
